# Pydantic models — Review, ReviewComment, ReviewStatus
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key = True)
    pr_url = Column(String)
    owner = Column(String)
    repo = Column(String) 
    pr_number = Column(Integer)
    status = Column(String)
    created_at = Column(DateTime)

    comments = relationship("ReviewComment", back_populates="review")


class ReviewComment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key = True)
    review_id = Column(Integer, ForeignKey("reviews.id"))
    line = Column(Integer)
    file = Column(String)
    severity = Column(String)
    category = Column(String)
    comment = Column(String)
    suggestion = Column(String)

    review = relationship("Review", back_populates="comments")
