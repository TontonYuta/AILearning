"""Test suite for Chapter 2 Python Mastery code examples."""
import asyncio
import time
import pytest
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

class ToolCallTelemetry(BaseModel):
    """Schema bat bien xac thuc ket qua thuc thi cong cu cua LLM."""
    tool_name: str = Field(..., description="Ten cong cu duoc goi")
    execution_latency_ms: float = Field(..., ge=0.0)
    status: str
    output_tokens: int = Field(default=0, ge=0)

    @field_validator("tool_name")
    @classmethod
    def validate_tool_name_safe(cls, v: str) -> str:
        if not v.replace("_", "").isalnum():
            raise ValueError(f"Ten cong cu chi duoc phep chua ky tu chu, so va gach duoi: {v}")
        return v

class GatewayTaskRequest(BaseModel):
    request_id: str
    payload: str = Field(..., min_length=1)
    cost_tokens: int = Field(default=1, ge=1)

class GatewayTaskResponse(BaseModel):
    request_id: str
    processed_content: str
    latency_ms: float
    status: str

class AsyncTokenBucketRateLimiter:
    """Bo dieu phoi toc do bat dong bo dung thuat toan Token Bucket."""
    def __init__(self, capacity: float, refill_rate: float):
        self.capacity = float(capacity)
        self.refill_rate = float(refill_rate)
        self.tokens = float(capacity)
        self.last_refill_time = time.monotonic()
        self.lock = asyncio.Lock()

    async def acquire(self, tokens_needed: float) -> float:
        async with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_refill_time
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            self.last_refill_time = now

            if self.tokens >= tokens_needed:
                self.tokens -= tokens_needed
                return 0.0

            deficit = tokens_needed - self.tokens
            wait_time = deficit / self.refill_rate
            self.tokens = 0.0
            self.last_refill_time = now + wait_time

        await asyncio.sleep(wait_time)
        return wait_time

class HighThroughputAIGateway:
    def __init__(self, bucket_capacity: float = 20.0, refill_rate: float = 100.0):
        self.limiter = AsyncTokenBucketRateLimiter(bucket_capacity, refill_rate)
        self.total_processed = 0

    async def _dispatch_llm_inference(self, prompt: str) -> str:
        await asyncio.sleep(0.001)
        return f"[PROCESSED]: {prompt.strip().upper()}"

    async def handle_request(self, request: GatewayTaskRequest) -> GatewayTaskResponse:
        t_start = time.perf_counter()
        await self.limiter.acquire(request.cost_tokens)
        output = await self._dispatch_llm_inference(request.payload)
        t_elapsed = (time.perf_counter() - t_start) * 1000.0
        self.total_processed += 1
        return GatewayTaskResponse(
            request_id=request.request_id,
            processed_content=output,
            latency_ms=round(t_elapsed, 2),
            status="SUCCESS"
        )

    async def batch_execute(self, requests: List[GatewayTaskRequest]) -> List[GatewayTaskResponse]:
        responses: List[Optional[GatewayTaskResponse]] = [None] * len(requests)
        async def _worker(idx: int, req: GatewayTaskRequest):
            responses[idx] = await self.handle_request(req)

        async with asyncio.TaskGroup() as tg:
            for i, req in enumerate(requests):
                tg.create_task(_worker(i, req))
        return [r for r in responses if r is not None]

class BoundedTensorDescriptor:
    def __init__(self, name: str, min_val: float = 0.0, max_val: float = 1.0):
        self.name = name
        self.min_val = min_val
        self.max_val = max_val
        self._storage_name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self._storage_name, None)

    def __set__(self, instance, value: float):
        if not (self.min_val <= value <= self.max_val):
            raise ValueError(f"{self.name} phai nam trong khoang [{self.min_val}, {self.max_val}]. Nhan duoc: {value}")
        setattr(instance, self._storage_name, value)

class MockModelConfig:
    temperature = BoundedTensorDescriptor("temperature", 0.0, 2.0)
    top_p = BoundedTensorDescriptor("top_p", 0.0, 1.0)

    def __init__(self, temperature: float = 0.7, top_p: float = 0.9):
        self.temperature = temperature
        self.top_p = top_p

class ChunkNodeWithSlots:
    __slots__ = ("chunk_id", "doc_id", "embedding", "token_count")
    def __init__(self, chunk_id: str, doc_id: str, embedding: list[float], token_count: int):
        self.chunk_id = chunk_id
        self.doc_id = doc_id
        self.embedding = embedding
        self.token_count = token_count

class AsyncCircuitBreaker:
    """Circuit Breaker voi 3 trang thai: CLOSED, OPEN, HALF_OPEN."""
    def __init__(self, failure_threshold: float = 0.5, window_size: int = 10, recovery_timeout: float = 0.1):
        self.failure_threshold = failure_threshold
        self.window_size = window_size
        self.recovery_timeout = recovery_timeout
        self.state = "CLOSED"
        self.history: List[bool] = []
        self.opened_at = 0.0

    def record_result(self, success: bool):
        self.history.append(success)
        if len(self.history) > self.window_size:
            self.history.pop(0)

        failures = self.history.count(False)
        rate = failures / len(self.history)
        if rate >= self.failure_threshold and len(self.history) >= self.window_size:
            self.state = "OPEN"
            self.opened_at = time.monotonic()

    def allow_request(self) -> bool:
        if self.state == "CLOSED":
            return True
        if self.state == "OPEN":
            if time.monotonic() - self.opened_at >= self.recovery_timeout:
                self.state = "HALF_OPEN"
                return True
            return False
        if self.state == "HALF_OPEN":
            return True
        return False

# ======================== TESTS ========================

def test_pydantic_tool_telemetry_valid():
    telemetry = ToolCallTelemetry(
        tool_name="vector_search_v2",
        execution_latency_ms=45.2,
        status="SUCCESS",
        output_tokens=128
    )
    assert telemetry.tool_name == "vector_search_v2"
    assert telemetry.execution_latency_ms == 45.2

def test_pydantic_tool_telemetry_invalid_name():
    with pytest.raises(ValueError):
        ToolCallTelemetry(
            tool_name="search!query-invalid",
            execution_latency_ms=10.0,
            status="FAILED"
        )

def test_bounded_tensor_descriptor():
    cfg = MockModelConfig(temperature=1.2, top_p=0.8)
    assert cfg.temperature == 1.2
    assert cfg.top_p == 0.8

    with pytest.raises(ValueError):
        cfg.temperature = 2.5  # Exceeds max_val 2.0

    with pytest.raises(ValueError):
        cfg.top_p = -0.1  # Subceeds min_val 0.0

def test_chunk_node_slots():
    node = ChunkNodeWithSlots(
        chunk_id="chk-01",
        doc_id="doc-99",
        embedding=[0.1, 0.2, 0.3],
        token_count=3
    )
    assert node.chunk_id == "chk-01"
    assert not hasattr(node, "__dict__")  # Confirms __slots__ optimization

def test_zero_copy_memoryview():
    raw_buffer = bytearray(b"HEADER_PREFIX_12345_DATA_PAYLOAD_TENSOR")
    view = memoryview(raw_buffer)
    slice_view = view[14:19]
    assert slice_view.tobytes() == b"12345"
    # Mutating via slice mutates the underlying raw buffer zero-copy
    slice_view[0] = ord("9")
    assert raw_buffer[14:19] == b"92345"

def test_async_token_bucket_and_gateway():
    async def run_gateway():
        gateway = HighThroughputAIGateway(bucket_capacity=10.0, refill_rate=50.0)
        requests = [
            GatewayTaskRequest(request_id=f"req-{i}", payload=f"prompt {i}", cost_tokens=1)
            for i in range(5)
        ]
        results = await gateway.batch_execute(requests)
        assert len(results) == 5
        assert all(r.status == "SUCCESS" for r in results)
        assert gateway.total_processed == 5

    asyncio.run(run_gateway())

def test_async_circuit_breaker():
    cb = AsyncCircuitBreaker(failure_threshold=0.5, window_size=4, recovery_timeout=0.05)
    assert cb.allow_request() is True

    # Record 2 successes, 2 failures -> 50% failures
    cb.record_result(True)
    cb.record_result(False)
    cb.record_result(True)
    cb.record_result(False)

    assert cb.state == "OPEN"
    assert cb.allow_request() is False

    # Wait for recovery timeout
    time.sleep(0.06)
    assert cb.allow_request() is True
    assert cb.state == "HALF_OPEN"
