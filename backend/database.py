from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database file for the application
DATABASE_URL = "sqlite:///./app.db"
# Engine connects our Python app to the database
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
# Session factory used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
