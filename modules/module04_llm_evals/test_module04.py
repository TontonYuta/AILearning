"""
test_module04.py — Bộ kiểm thử tự động cho LLM Evals và LLM-as-a-Judge.
"""
import pytest
from modules.module04_llm_evals.metrics import (
    compute_faithfulness,
    compute_answer_relevance,
    compute_ground_truth_similarity
)
from modules.module04_llm_evals.judge import LLMJudge

def test_faithfulness_metric():
    context = "Hệ thống sử dụng cơ chế Token Bucket để kiểm soát lưu lượng 100 req/s."
    grounded_answer = "Hệ thống áp dụng Token Bucket để kiểm soát lưu lượng với giới hạn 100 req/s."
    hallucinated_answer = "Hệ thống sử dụng công nghệ blockchain lượng tử với vệ tinh vũ trụ không giới hạn."

    score_grounded, _ = compute_faithfulness(grounded_answer, context)
    score_hallucinated, _ = compute_faithfulness(hallucinated_answer, context)

    assert score_grounded >= 0.8
    assert score_hallucinated < 0.5

def test_answer_relevance_metric():
    question = "Thời gian phản hồi P99 của hệ thống là bao nhiêu?"
    on_topic = "Thời gian phản hồi P99 của hệ thống hiện tại là dưới 80 mili-giây."
    off_topic = "Trời hôm nay nhiều mây và có thể có mưa rào vào buổi chiều tối."

    score_on = compute_answer_relevance(question, on_topic)
    score_off = compute_answer_relevance(question, off_topic)

    assert score_on >= 0.7
    assert score_off < 0.3

def test_judge_evaluation_pass_fail():
    judge = LLMJudge()
    context = "Mật khẩu quản trị phải dài tối thiểu 16 ký tự và đổi định kỳ 90 ngày."
    good_answer = "Theo quy định, mật khẩu quản trị phải dài ít nhất 16 ký tự và được thay đổi mỗi 90 ngày."
    bad_answer = "Mật khẩu chỉ cần 4 số và không bao giờ phải đổi, có thể ghi ra giấy dán lên màn hình."

    res_good = judge.evaluate("Quy định mật khẩu là gì?", context, good_answer)
    res_bad = judge.evaluate("Quy định mật khẩu là gì?", context, bad_answer)

    assert res_good.passed is True
    assert res_good.score >= 4
    assert res_good.has_hallucination is False

    assert res_bad.passed is False
    assert res_bad.score <= 3

def test_ground_truth_similarity():
    actual = "Thành phố Hà Nội là thủ đô của Việt Nam"
    expected = "Hà Nội là thủ đô của nước Việt Nam"
    sim = compute_ground_truth_similarity(actual, expected)
    assert sim >= 0.6
