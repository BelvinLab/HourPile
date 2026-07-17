from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

# Le moteur : point de connexion unique au SGBD.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Fabrique de sessions : une session = une conversation avec la base.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    """Classe mère de tous les modèles ORM. Alembic s'en sert pour
    détecter les tables à créer/modifier."""
    pass


def get_db():
    """Dépendance FastAPI : ouvre une session, la fournit, la referme."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
