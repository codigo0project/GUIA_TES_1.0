"""Structured JSON logging and per-request contextual middleware."""

import json
import logging
import time
import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from core.config import settings
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

# Extra fields attached to a record by the middleware.
CONTEXT_FIELDS = ("request_id", "path", "latency_ms", "method", "status_code")


class JsonFormatter(logging.Formatter):
    """Emit a single JSON line per log record."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "time": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
        }
        for field in CONTEXT_FIELDS:
            value = getattr(record, field, None)
            if value is not None:
                payload[field] = value
        return json.dumps(payload, ensure_ascii=False)


def setup_logging() -> None:
    """Configure the root logger with a single JSON stdout handler."""
    root = logging.getLogger()
    root.setLevel(settings.log_level.upper())
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root.handlers = [handler]
    # Route uvicorn access logs through the same structured handler.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logging.getLogger(name).handlers = [handler]
        logging.getLogger(name).propagate = False


class RequestLogMiddleware(BaseHTTPMiddleware):
    """Attach request_id and log path + latency for every request."""

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

        logging.getLogger("request").info(
            "request completed",
            extra={
                "request_id": request_id,
                "path": request.url.path,
                "latency_ms": elapsed_ms,
                "method": request.method,
                "status_code": response.status_code,
            },
        )
        response.headers["X-Request-ID"] = request_id
        return response
