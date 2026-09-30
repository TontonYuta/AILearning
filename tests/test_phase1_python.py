"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Chương 1: Python Mastery."""

import pytest
import asyncio
from typing import Callable, Any, Generator, List
from abc import ABC, abstractmethod
from pydantic import BaseModel, Field, field_validator

# 1. Test Retry Decorator
def retry_with_backoff(max_retries: int = 3, base_delay: float = 0.01):
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            attempt = 0
            while attempt < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt >= max_retries:
                        raise e
            return func(*args, **kwargs)
        return wrapper
    return decorator

def test_retry_decorator_success():
    calls = 0
    @retry_with_backoff(max_retries=3, base_delay=0.001)
    def flaky_service():
        nonlocal calls
        calls += 1
        if calls < 2:
            raise ConnectionError("Mang chap chon")
        return "success"

    assert flaky_service() == "success"
    assert calls == 2

def test_retry_decorator_fails_after_limit():
    @retry_with_backoff(max_retries=2, base_delay=0.001)
    def always_broken():
        raise RuntimeError("Loi he thong")

    with pytest.raises(RuntimeError):
        always_broken()

# 2. Test Composition & OOP
class LLMProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> str:
        pass

class MockOpenAIProvider(LLMProvider):
    def generate(self, prompt: str) -> str:
        return f"[OpenAI Response]: {prompt}"

class AIAssistant:
    def __init__(self, provider: LLMProvider):
        self.provider = provider
    def answer(self, question: str) -> str:
        return self.provider.generate(question.strip())

def test_ai_assistant_composition():
    provider = MockOpenAIProvider()
    assistant = AIAssistant(provider)
    res = assistant.answer("  Hoc AI  ")
    assert res == "[OpenAI Response]: Hoc AI"

# 3. Test Generators & Streaming
def stream_tokens_from_llm(sentence: str) -> Generator[str, None, None]:
    for word in sentence.split():
        yield word + " "

def test_stream_tokens():
    gen = stream_tokens_from_llm("Ky su AI")
    tokens = list(gen)
    assert tokens == ["Ky ", "su ", "AI "]

# 4. Test Pydantic Schema
class ExtractedEntity(BaseModel):
    name: str
    category: str
    confidence: float = Field(ge=0.0, le=1.0)

class StructuredAnalysisOutput(BaseModel):
    summary: str = Field(min_length=5)
    entities: List[ExtractedEntity]
    
    @field_validator("summary")
    @classmethod
    def prevent_empty_summary(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Summary khong duoc chua khoang trang rong")
        return v

def test_pydantic_validation():
    data = {
        "summary": "Tom tat noi dung phan tich",
        "entities": [{"name": "Qdrant", "category": "VECTOR_DB", "confidence": 0.98}]
    }
    model = StructuredAnalysisOutput(**data)
    assert model.entities[0].name == "Qdrant"
    
    with pytest.raises(Exception):
        StructuredAnalysisOutput(summary="   ", entities=[])

# 5. Test Asyncio Concurrency
def test_async_parallel_execution():
    async def run():
        async def mock_fetch(val: int):
            await asyncio.sleep(0.001)
            return val * 2
        return await asyncio.gather(mock_fetch(1), mock_fetch(2), mock_fetch(3))

    results = asyncio.run(run())
    assert results == [2, 4, 6]
