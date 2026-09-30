"""Unit test xác thực toàn bộ mã nguồn ví dụ trong Chương 2: Systems, Networking & Backend."""

import pytest
import asyncio
import json
from pydantic import BaseModel, Field

# 1. Test ChatRequest Schema
class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    stream: bool = False

def test_chat_request_validation():
    req = ChatRequest(message="Xin chao", stream=True)
    assert req.message == "Xin chao"
    assert req.stream is True
    
    with pytest.raises(Exception):
        ChatRequest(message="")

# 2. Test Streaming Tokens Generator
async def generate_mock_tokens(prompt: str):
    words = prompt.split()
    for w in words:
        await asyncio.sleep(0.001)
        payload = json.dumps({"token": w + " "})
        yield f"data: {payload}\n\n"
    yield "data: [DONE]\n\n"

def test_generate_mock_tokens_stream():
    async def run():
        chunks = []
        async for chunk in generate_mock_tokens("Ky su AI Backend"):
            chunks.append(chunk)
        return chunks
    
    chunks = asyncio.run(run())
    assert len(chunks) == 5  # 4 words + [DONE]
    assert "Ky" in chunks[0]
    assert chunks[-1] == "data: [DONE]\n\n"

# 3. Test SimpleRateLimiter
class SimpleRateLimiter:
    def __init__(self, max_requests: int = 3, window_seconds: int = 10):
        self.max_requests = max_requests
        self.window = window_seconds
        self.storage = {}

    def is_allowed(self, user_id: str, current_time: float) -> bool:
        user_history = self.storage.get(user_id, [])
        valid_history = [t for t in user_history if current_time - t < self.window]
        
        if len(valid_history) >= self.max_requests:
            self.storage[user_id] = valid_history
            return False
            
        valid_history.append(current_time)
        self.storage[user_id] = valid_history
        return True

def test_rate_limiter():
    limiter = SimpleRateLimiter(max_requests=2, window_seconds=5)
    user = "user_123"
    
    assert limiter.is_allowed(user, 1.0) is True
    assert limiter.is_allowed(user, 2.0) is True
    # Request thu 3 bi chan
    assert limiter.is_allowed(user, 3.0) is False
    # Sau 5 giay (tai giay thu 7) duoc phep goi lai
    assert limiter.is_allowed(user, 7.5) is True
