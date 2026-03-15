# FastAPI app entrypoint — CORS, lifespan, router registration
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.db.database import init_db
from backend.routers import webhooks, reviews, auth, feedback, settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="AI Code Review Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(settings.router, prefix="/settings", tags=["settings"])


@app.get("/")
async def status():
    return {"status": "ok"}