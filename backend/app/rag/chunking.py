"""
STEP 1 of RAG — chunking.

We cut each knowledge file into small pieces ("chunks") so that, when a
visitor asks something, we can find just the few pieces that matter.

Strategy (beginner friendly):
  1. Split the file at Markdown headings  (# Title, ## Section …)
  2. If a section is still long, split it at paragraph / sentence borders
     into pieces of about `max_chars` characters, with a small overlap so
     a sentence that sits on a border is not lost.
  3. Every chunk remembers its file name and heading (used as context).

No external libraries — pure Python.
"""
import re
from dataclasses import dataclass

HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
HEADING = re.compile(r"^(#{1,6})\s+(.*)$")


@dataclass
class Chunk:
    text: str
    source: str     # file name, e.g. "projects/courtify.md"
    heading: str    # nearest heading, e.g. "Courtify"
    index: int      # position inside the file


def _sections(markdown: str) -> list[tuple[str, str]]:
    """Return [(heading, body_text), …]. Text before the first heading gets heading ''."""
    sections: list[tuple[str, list[str]]] = [("", [])]
    for line in markdown.splitlines():
        m = HEADING.match(line)
        if m:
            sections.append((m.group(2).strip(), []))
        else:
            sections[-1][1].append(line)
    return [(h, "\n".join(lines).strip()) for h, lines in sections if "\n".join(lines).strip()]


def _split_long(text: str, max_chars: int, overlap: int) -> list[str]:
    """Split a long text at sentence borders into pieces <= max_chars (with overlap)."""
    if len(text) <= max_chars:
        return [text]
    sentences = re.split(r"(?<=[.!?])\s+|\n{2,}", text)
    pieces, current = [], ""
    for s in sentences:
        if current and len(current) + len(s) + 1 > max_chars:
            pieces.append(current.strip())
            tail = current[-overlap:] if overlap else ""
            current = (tail + " " + s).strip() if tail else s
        else:
            current = f"{current} {s}".strip()
    if current.strip():
        pieces.append(current.strip())
    return pieces


def chunk_markdown(text: str, source: str, max_chars: int = 900, overlap: int = 120) -> list[Chunk]:
    """Cut one Markdown document into chunks."""
    text = HTML_COMMENT.sub("", text)  # drop <!-- notes to yourself -->
    chunks: list[Chunk] = []
    for heading, body in _sections(text):
        for piece in _split_long(body, max_chars, overlap):
            # Putting the heading inside the chunk helps the search find it
            full = f"{heading}\n{piece}" if heading else piece
            chunks.append(Chunk(text=full, source=source, heading=heading, index=len(chunks)))
    return chunks
