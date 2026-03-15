# Async SQLAlchemy setup — engine, session factory, base model
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from backend.models.review import Base
import backend.models.feedback  # noqa: F401 — register table
import backend.models.user  # noqa: F401 — register table
import backend.models.pattern  # noqa: F401 — register table

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./reviews.db")

engine = create_async_engine(DATABASE_URL, echo=False)

async_session = async_sessionmaker(engine, expire_on_commit=False)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with async_session() as session:
        yield session