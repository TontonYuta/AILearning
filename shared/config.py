"""
Cấu hình tập trung cho toàn bộ kho mã nguồn AI Engineering Thực Chiến.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Tự động nạp file .env từ thư mục gốc
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

class Settings:
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # Local Ollama / vLLM
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
    
    # Vector DB
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Project Paths
    ROOT_PATH: Path = ROOT_DIR
    MODULES_PATH: Path = ROOT_DIR / "modules"
    PROJECTS_PATH: Path = ROOT_DIR / "projects"

settings = Settings()
