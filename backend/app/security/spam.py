"""Basic spam checks for the contact form (pure functions — easy to test)."""
import re

URL_RE = re.compile(r"https?://|www\.", re.IGNORECASE)


def is_spam(honeypot: str, elapsed_ms: int, message: str, min_fill_seconds: int = 3) -> bool:
    """
    True if the submission looks like a bot:
      1. the hidden "website" field was filled in (humans can't see it)
      2. the form was submitted faster than a human could type it
      3. the message is stuffed with links
    """
    if honeypot and honeypot.strip():
        return True
    if elapsed_ms < min_fill_seconds * 1000:
        return True
    if len(URL_RE.findall(message)) > 3:
        return True
    return False


def clean_header(value: str) -> str:
    """Remove line breaks so nobody can inject extra email headers."""
    return re.sub(r"[\r\n\t]+", " ", value).strip()
