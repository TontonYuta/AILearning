"""
Unit tests for Chapter 15: Career Mastery, Portfolio & Technical Interviews
Covers:
- ATS formula validation: Jaccard, Precision, Recall
- Expected Equity Value calculation (Exercise B.2)
- ATSResumeValidator (Core keyword matching, Google XYZ regex detection, scoring)
- SemanticResumeMatcher (Cosine similarity matching)
"""

import re
import math
from typing import Dict, Any, List, Set, Tuple
import pytest

# ==============================================================================
# 1. ATS METRIC FORMULAS & EQUITY VALUATION
# ==============================================================================

def compute_ats_overlap_metrics(
    cv_keywords_count: int,
    jd_keywords_count: int,
    overlap_count: int
) -> Tuple[float, float, float]:
    """Returns (jaccard_similarity, recall, precision)."""
    union_count = cv_keywords_count + jd_keywords_count - overlap_count
    jaccard = overlap_count / union_count if union_count > 0 else 0.0
    recall = overlap_count / jd_keywords_count if jd_keywords_count > 0 else 0.0
    precision = overlap_count / cv_keywords_count if cv_keywords_count > 0 else 0.0
    return jaccard, recall, precision

def calculate_expected_equity_value(
    shares: int,
    strike_price: float,
    ipo_price: float,
    success_probability: float,
    vesting_years: int = 4
) -> Tuple[float, float]:
    """Returns (total_expected_value, annual_expected_value)."""
    net_gain_per_share = max(0.0, ipo_price - strike_price)
    total_potential = shares * net_gain_per_share
    total_expected = total_potential * success_probability
    annual_expected = total_expected / vesting_years
    return total_expected, annual_expected

def test_ats_overlap_metrics():
    # Exercise B.1: CV=240, JD=80, Overlap=60
    jaccard, recall, precision = compute_ats_overlap_metrics(240, 80, 60)
    assert jaccard == pytest.approx(60 / 260, abs=1e-4) # ~0.2308
    assert recall == pytest.approx(0.75, abs=1e-4)      # 75%
    assert precision == pytest.approx(0.25, abs=1e-4)   # 25%

def test_expected_equity_valuation():
    # Exercise B.2: 50,000 shares, strike $2, ipo $20, prob 25%, 4 years
    total_exp, annual_exp = calculate_expected_equity_value(
        shares=50000,
        strike_price=2.0,
        ipo_price=20.0,
        success_probability=0.25,
        vesting_years=4
    )
    assert total_exp == 225000.0
    assert annual_exp == 56250.0

# ==============================================================================
# 2. ATS RESUME VALIDATOR
# ==============================================================================

class ATSResumeValidator:
    CORE_KEYWORDS: Set[str] = {
        "python", "pytorch", "transformer", "attention", "llm", "rag",
        "langgraph", "vllm", "docker", "redis", "qdrant", "guardrails",
        "latency", "qps", "throughput"
    }

    QUANT_PATTERNS = [
        re.compile(r"\b\d+%"),
        re.compile(r"\b\d+\s*(ms|s|giay)\b"),
        re.compile(r"\$\s*\d+([,\.]\d+)?\s*(k|m|usd)?\b", re.IGNORECASE),
        re.compile(r"\b\d+\s*(qps|tokens/s)\b", re.IGNORECASE)
    ]

    def __init__(self, job_description: str):
        self.jd_tokens = self._tokenize(job_description)

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        return re.findall(r"\b[a-zA-Z0-9_\-\./]+\b", text.lower())

    def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        resume_tokens = self._tokenize(resume_text)
        resume_token_set = set(resume_tokens)

        matched_keywords = self.CORE_KEYWORDS.intersection(resume_token_set)
        keyword_coverage = len(matched_keywords) / len(self.CORE_KEYWORDS)

        quant_matches = []
        for line in resume_text.splitlines():
            for pat in self.QUANT_PATTERNS:
                if pat.search(line):
                    quant_matches.append(line.strip())
                    break

        jd_set = set(self.jd_tokens)
        intersection = resume_token_set.intersection(jd_set)
        union = resume_token_set.union(jd_set)
        jaccard_similarity = len(intersection) / len(union) if union else 0.0

        ats_score = (
            (keyword_coverage * 50.0) + 
            (min(len(quant_matches), 5) * 6.0) + 
            (min(jaccard_similarity * 200.0, 20.0))
        )

        return {
            "ats_score": round(ats_score, 1),
            "keyword_coverage_percent": round(keyword_coverage * 100.0, 1),
            "matched_core_keywords": sorted(list(matched_keywords)),
            "missing_core_keywords": sorted(list(self.CORE_KEYWORDS - resume_token_set)),
            "quantified_accomplishments_count": len(quant_matches),
            "is_ats_ready": ats_score >= 70.0
        }

def test_ats_resume_validator():
    jd = "We are seeking a Senior AI Engineer skilled in Python, PyTorch, vLLM, LangGraph, Qdrant, Docker."
    validator = ATSResumeValidator(jd)

    strong_resume = """
    Senior AI Engineer with deep expertise in Python, PyTorch, Transformer, and Attention mechanisms.
    - Designed Enterprise Hybrid RAG using LangGraph and Qdrant, reducing latency by 450ms and improving recall by 91%.
    - Deployed high-throughput serving cluster with vLLM and Docker, scaling to 2500 tokens/s at 3500 QPS.
    - Built Multi-Agent platform with Redis, Guardrails, reducing operational costs by $150k annually for LLM applications.
    """
    analysis = validator.analyze_resume(strong_resume)
    assert analysis["ats_score"] >= 75.0
    assert analysis["is_ats_ready"] is True
    assert analysis["quantified_accomplishments_count"] >= 3
    assert "python" in analysis["matched_core_keywords"]
    assert "vllm" in analysis["matched_core_keywords"]

# ==============================================================================
# 3. SEMANTIC RESUME MATCHER
# ==============================================================================

class SemanticResumeMatcher:
    @staticmethod
    def cosine_similarity(v_cv: List[float], v_jd: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(v_cv, v_jd))
        norm_cv = math.sqrt(sum(a * a for a in v_cv))
        norm_jd = math.sqrt(sum(b * b for b in v_jd))
        if norm_cv == 0.0 or norm_jd == 0.0:
            return 0.0
        return dot_product / (norm_cv * norm_jd)

    def evaluate_fit(self, v_cv: List[float], v_jd: List[float], threshold: float = 0.82) -> bool:
        score = self.cosine_similarity(v_cv, v_jd)
        return score >= threshold

def test_semantic_resume_matcher():
    matcher = SemanticResumeMatcher()
    v1 = [1.0, 0.0, 0.0]
    v2 = [0.95, 0.31, 0.0]
    assert matcher.evaluate_fit(v1, v2, threshold=0.85) is True

    v3 = [0.0, 1.0, 0.0]
    assert matcher.evaluate_fit(v1, v3, threshold=0.85) is False
