"""
A tiny in-memory rate limiter (sliding window). Good enough for a personal
portfolio running as ONE server process. If you ever run several server
processes, replace it with Redis.
"""
import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self, max_calls: int, window_seconds: float):
        self.max_calls = max_calls
        self.window = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)

    def allow(self, key: str, now: float | None = None) -> bool:
        """Return True if `key` may make another call right now."""
        now = time.monotonic() if now is None else now
        q = self._hits[key]
        while q and now - q[0] > self.window:  # forget old calls
            q.popleft()
        if len(q) >= self.max_calls:
            return False
        q.append(now)
        # keep memory small: drop empty keys occasionally
        if len(self._hits) > 5000:
            for k in [k for k, v in self._hits.items() if not v]:
                del self._hits[k]
        return True
