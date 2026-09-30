"""Test suite for Chapter 2 Python Mastery code examples."""
import asyncio
import pytest
import random
from typing import List
from pydantic import BaseModel, Field, field_validator

class SecurityThreatReport(BaseModel):
    threat_id: str
    source_ip: str
    severity: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)

    @field_validator("source_ip")
    @classmethod
    def validate_ip_format(cls, v: str) -> str:
        parts = v.strip().split(".")
        if len(parts) != 4 or not all(p.isdigit() and 0 <= int(p) <= 255 for p in parts):
            raise ValueError(f"Dinh dang IP khong hop le: {v}")
        return v

class TaskRequest(BaseModel):
    task_id: str
    payload: str
    priority: int = Field(default=1, ge=1, le=5)

class TaskResult(BaseModel):
    task_id: str
    processed_content: str
    execution_time_ms: float
    status: str

class AsyncAIWorkerPool:
    def __init__(self, concurrency_limit: int = 5, max_retries: int = 3):
        self.semaphore = asyncio.Semaphore(concurrency_limit)
        self.max_retries = max_retries
        self.processed_counter = 0

    async def _mock_remote_ai_call(self, text: str) -> str:
        await asyncio.sleep(0.005)
        return f"[AI Processed]: {text.upper()}"

    async def execute_task_with_resilience(self, request: TaskRequest) -> TaskResult:
        t_start = asyncio.get_event_loop().time()
        async with self.semaphore:
            result_text = await self._mock_remote_ai_call(request.payload)
            t_elapsed = (asyncio.get_event_loop().time() - t_start) * 1000.0
            self.processed_counter += 1
            return TaskResult(
                task_id=request.task_id,
                processed_content=result_text,
                execution_time_ms=round(t_elapsed, 2),
                status="SUCCESS"
            )

    async def process_batch(self, requests: List[TaskRequest]) -> List[TaskResult]:
        tasks = [self.execute_task_with_resilience(req) for req in requests]
        results = await asyncio.gather(*tasks)
        return list(results)

def test_pydantic_security_report_valid():
    report = SecurityThreatReport(
        threat_id="THR-001",
        source_ip="192.168.1.100",
        severity="CRITICAL",
        confidence_score=0.95
    )
    assert report.source_ip == "192.168.1.100"
    assert report.confidence_score == 0.95

def test_pydantic_security_report_invalid_ip():
    with pytest.raises(ValueError):
        SecurityThreatReport(
            threat_id="THR-002",
            source_ip="999.999.999.999",
            severity="HIGH",
            confidence_score=0.8
        )

def test_async_ai_worker_pool():
    async def run_pool():
        pool = AsyncAIWorkerPool(concurrency_limit=3)
        requests = [
            TaskRequest(task_id=f"T-{i}", payload=f"text {i}")
            for i in range(10)
        ]
        results = await pool.process_batch(requests)
        assert len(results) == 10
        assert all(r.status == "SUCCESS" for r in results)
        assert pool.processed_counter == 10

    asyncio.run(run_pool())
