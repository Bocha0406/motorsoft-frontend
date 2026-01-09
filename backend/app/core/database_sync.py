"""
Synchronous database connection (temporary)
Using psycopg2 instead of asyncpg due to connection issues
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Create sync engine
# Remove +asyncpg from URL if present
database_url = settings.DATABASE_URL.replace("+asyncpg", "")
engine = create_engine(
    database_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db_sync() -> Session:
    """Dependency for getting database session (sync)"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
