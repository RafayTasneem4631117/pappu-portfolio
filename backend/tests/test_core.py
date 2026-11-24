"""Run with:  cd backend && python -m pytest -q
These tests need no internet, API keys or heavy libraries."""
from pathlib import Path

from app.rag.chunking import chunk_markdown
from app.rag.ingest import load_chunks
from app.security.rate_limit import RateLimiter
from app.security.spam import clean_header, is_spam


def test_chunking_splits_on_headings_and_drops_comments():
    md = "<!-- secret note -->\n# One\nHello world.\n\n# Two\nSecond section."
    chunks = chunk_markdown(md, "x.md")
    assert [c.heading for c in chunks] == ["One", "Two"]
    assert all("secret" not in c.text for c in chunks)


def test_long_sections_are_split_with_limit():
    md = "# Long\n" + " ".join(f"Sentence number {i} is here." for i in range(200))
    chunks = chunk_markdown(md, "long.md", max_chars=300, overlap=40)
    assert len(chunks) > 3
    assert all(len(c.text) <= 300 + 60 for c in chunks)  # heading + overlap allowance


def test_knowledge_folder_loads_and_skips_templates():
    folder = Path(__file__).resolve().parents[1] / "knowledge"
    chunks = load_chunks(folder)
    sources = {c.source for c in chunks}
    assert "about.md" in sources and "education.md" in sources
    assert not any(s.endswith("_TEMPLATE.md") for s in sources)
    assert any("NED University" in c.text for c in chunks)


def test_spam_rules():
    assert is_spam("http://spam", 9000, "hello there")          # honeypot filled
    assert is_spam("", 500, "hello there friend")                # too fast
    assert is_spam("", 9000, "http://a http://b http://c http://d")  # link stuffing
    assert not is_spam("", 9000, "Hi Rafay, love your work!")


def test_header_injection_removed():
    assert "\n" not in clean_header("Hello\r\nBcc: evil@example.com")


def test_rate_limiter_window():
    rl = RateLimiter(max_calls=2, window_seconds=10)
    assert rl.allow("ip", now=0) and rl.allow("ip", now=1)
    assert not rl.allow("ip", now=2)       # 3rd call blocked
    assert rl.allow("ip", now=12)          # window passed
    assert rl.allow("other", now=2)        # different visitor unaffected
