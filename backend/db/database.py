# Async SQLAlchemy setup — engine, session factory, base model
import logging
import os
from dotenv import load_dotenv
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from backend.models.review import Base

logger = logging.getLogger(__name__)
import backend.models.feedback  # noqa: F401 — register table
import backend.models.user  # noqa: F401 — register table
import backend.models.pattern  # noqa: F401 — register table

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./reviews.db")

engine = create_async_engine(DATABASE_URL, echo=False)

async_session = async_sessionmaker(engine, expire_on_commit=False)


def _add_missing_columns(conn):
    """Add any columns defined in models but missing from the DB."""
    inspector = inspect(conn)
    for table_name, table in Base.metadata.tables.items():
        if not inspector.has_table(table_name):
            continue
        existing = {col["name"] for col in inspector.get_columns(table_name)}
        for col in table.columns:
            if col.name not in existing:
                col_type = col.type.compile(conn.dialect)
                conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {col.name} {col_type}"))
                logger.info("Added column %s.%s", table_name, col.name)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_add_missing_columns)


async def get_db():
    async with async_session() as session:
        yield session