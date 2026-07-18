from fastapi import FastAPI
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.routers import auth,users,session,vocabulary
app = FastAPI(title=settings.APP_NAME)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(session.router)
app.include_router(vocabulary.router)


@app.get("/")
def root():
    return {"app": settings.APP_NAME, "status": "ok"}


@app.get("/health")
def health():
    """Vérifie que l'API répond ET que la base est joignable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception as exc:  # noqa: BLE001
        return {"api": "ok", "database": "unreachable", "detail": str(exc)}
    return {"api": "ok", "database": "ok" if db_ok else "error"}
