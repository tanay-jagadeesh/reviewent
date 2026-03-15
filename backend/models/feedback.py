# SQLAlchemy model — CommentFeedback (thumbs up/down + optional note)
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from backend.models.review import Base


class CommentFeedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=False)
    helpful = Column(Boolean, nullable=False)  # True = thumbs up, False = thumbs down
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
