"""
chunker.py — Các chiến lược phân đoạn văn bản thông minh (Chunking Strategies).
"""
import re
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class TextChunk:
    chunk_id: str
    content: str
    char_start: int
    char_end: int
    metadata: Dict[str, Any] = field(default_factory=dict)

class RecursiveCharacterChunker:
    """
    Phân tách văn bản đệ quy theo thứ tự ưu tiên các dấu phân tách tự nhiên:
    Đoạn văn (\n\n) -> Xuống dòng (\n) -> Câu kết thúc (. ) -> Từ (khoảng trắng) -> Ký tự.
    Giúp giữ trọn vẹn ngữ cảnh cấu trúc ngữ pháp.
    """
    def __init__(self, chunk_size: int = 300, chunk_overlap: int = 50):
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap phải nhỏ hơn chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n", "\n", ". ", " ", ""]

    def split_text(self, text: str, base_metadata: Optional[Dict[str, Any]] = None) -> List[TextChunk]:
        base_metadata = base_metadata or {}
        raw_chunks = self._recursive_split(text, self.separators)
        
        # Hợp nhất các đoạn nhỏ sao cho không vượt quá chunk_size và có overlap
        merged_chunks: List[str] = []
        current_chunk = []
        current_len = 0

        for piece in raw_chunks:
            piece_len = len(piece)
            if current_len + piece_len > self.chunk_size and current_chunk:
                merged_chunks.append("".join(current_chunk).strip())
                # Giữ lại một phần cho overlap
                overlap_text = "".join(current_chunk)[-self.chunk_overlap:]
                current_chunk = [overlap_text, piece]
                current_len = len(overlap_text) + piece_len
            else:
                current_chunk.append(piece)
                current_len += piece_len

        if current_chunk:
            merged_chunks.append("".join(current_chunk).strip())

        # Gán id và vị trí char
        result: List[TextChunk] = []
        cursor = 0
        for idx, chunk_text in enumerate(merged_chunks):
            if not chunk_text:
                continue
            start_pos = text.find(chunk_text, cursor)
            if start_pos == -1:
                start_pos = cursor
            end_pos = start_pos + len(chunk_text)
            cursor = max(cursor, start_pos + 1)

            result.append(
                TextChunk(
                    chunk_id=f"chunk_{idx:04d}",
                    content=chunk_text,
                    char_start=start_pos,
                    char_end=end_pos,
                    metadata={**base_metadata, "index": idx}
                )
            )
        return result

    def _recursive_split(self, text: str, separators: List[str]) -> List[str]:
        if not separators:
            return [text]
        sep = separators[0]
        if sep == "":
            return list(text)

        splits = text.split(sep)
        result = []
        for i, split in enumerate(splits):
            piece = split if i == len(splits) - 1 else split + sep
            if len(piece) <= self.chunk_size:
                result.append(piece)
            else:
                result.extend(self._recursive_split(piece, separators[1:]))
        return result
