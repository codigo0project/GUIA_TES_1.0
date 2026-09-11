"""Guía TES API — FastAPI entrypoint.

Run from `app/api/`:
    uvicorn main:app --reload
"""

from core.config import settings
from core.logging import RequestLogMiddleware, setup_logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chapters, graph, health, search, terms

setup_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Read-only presentation API over knowledge/index.jsonl",
)

app.add_middleware(RequestLogMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# /health stays unversioned to satisfy acceptance criteria.
app.include_router(health.router)

# Versioned API routes (naming convention: /v1/...).
app.include_router(search.router, prefix=settings.api_prefix)
app.include_router(graph.router, prefix=settings.api_prefix)
app.include_router(terms.router, prefix=settings.api_prefix)
app.include_router(chapters.router, prefix=settings.api_prefix)

