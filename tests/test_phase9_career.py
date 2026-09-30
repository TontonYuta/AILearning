"""Test suite for Phase 9 Career Resume Bullet Point Validator."""
import pytest
import re
from typing import Dict, Any

class ResumeBulletPointValidator:
    """Kiem tra va cham diem chat luong dong mo ta du an tren CV."""
    
    STRONG_VERBS = {
        "architected", "optimized", "implemented", "engineered",
        "reduced", "scaled", "designed", "benchmarked", "deployed"
    }

    def evaluate_bullet(self, bullet: str) -> Dict[str, Any]:
        text_lower = bullet.lower()
        words = text_lower.split()
        
        first_word = words[0] if words else ""
        has_strong_verb = first_word in self.STRONG_VERBS
        
        has_metric = bool(re.search(r"(\d+%\s*|\d+\s*ms|\$\d+|\d+\s*users|\d+\s*docs)", text_lower))
        
        tech_keywords = ["qdrant", "vllm", "ragas", "docker", "fastapi", "redis", "langgraph"]
        has_tech = any(kw in text_lower for kw in tech_keywords)
        
        score = 0
        if has_strong_verb: score += 30
        if has_metric: score += 40
        if has_tech: score += 30
        
        return {
            "score": score,
            "has_strong_verb": has_strong_verb,
            "has_metric": has_metric,
            "has_tech_keyword": has_tech,
            "status": "PASS" if score >= 70 else "NEEDS_IMPROVEMENT"
        }

def test_resume_evaluator_weak_bullet():
    validator = ResumeBulletPointValidator()
    weak_bullet = "Helped team build a chatbot using AI for documents."
    result = validator.evaluate_bullet(weak_bullet)
    
    assert result["score"] < 70
    assert result["status"] == "NEEDS_IMPROVEMENT"
    assert result["has_strong_verb"] is False
    assert result["has_metric"] is False

def test_resume_evaluator_strong_bullet():
    validator = ResumeBulletPointValidator()
    strong_bullet = "Architected enterprise RAG system with Qdrant and FastAPI, reducing P99 latency by 45% for 10000 users."
    result = validator.evaluate_bullet(strong_bullet)
    
    assert result["score"] == 100
    assert result["status"] == "PASS"
    assert result["has_strong_verb"] is True
    assert result["has_metric"] is True
    assert result["has_tech_keyword"] is True
