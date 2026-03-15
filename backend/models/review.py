# SQLAlchemy models — Review, ReviewComment
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    pr_url = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    repo = Column(String, nullable=False)
    pr_number = Column(Integer, nullable=False)
    status = Column(String, default="pending")  # pending | in_progress | completed | failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    comments = relationship("ReviewComment", back_populates="review", cascade="all, delete-orphan")


class ReviewComment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    file = Column(String, nullable=False)
    line = Column(Integer)
    severity = Column(String)  # critical | warning | suggestion | nitpick
    category = Column(String)  # security | bug | performance | style | logic
    comment = Column(Text)
    suggestion = Column(Text)

    review = relationship("Review", back_populates="comments")
