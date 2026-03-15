# SQLAlchemy model — CodebasePattern (learned conventions per repo)
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text
from backend.models.review import Base


class CodebasePattern(Base):
    __tablename__ = "codebase_patterns"

    id = Column(Integer, primary_key=True)
    owner = Column(String, nullable=False)
    repo = Column(String, nullable=False)
    pattern = Column(Text, nullable=False)          # the convention/pattern description
    category = Column(String, nullable=False)        # e.g. "naming", "error-handling", "testing", "imports"
    source_file = Column(String, nullable=True)      # example file where pattern was observed
    occurrences = Column(Integer, default=1)          # how many times this pattern was flagged
    last_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
