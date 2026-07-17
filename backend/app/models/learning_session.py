from sqlalchemy import String, ForeignKey, func
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

# Import recommandé mais attention aux imports circulaires dans des gros projets.
# Si tu as une erreur d'import circulaire, retire ces lignes 
# et utilise des chaînes de caractères dans tes relationships ("User" au lieu de User).
from app.models.user import User
from app.models.language import Language

class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id_session: Mapped[int] = mapped_column(primary_key=True)
    duration: Mapped[int] = mapped_column()
    activity: Mapped[str] = mapped_column(String(30))
    session_date: Mapped[datetime] = mapped_column(server_default=func.now())
    note: Mapped[str | None] = mapped_column(String(500), default=None)
    resource: Mapped[str | None] = mapped_column(String(250), default=None)
    
    # 1. CORRECTION : "created_at:" avec deux points, et non "="
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    
    # 2. CORRECTION : Orthographe de la table étrangère "languages.id_language"
    id_language: Mapped[int] = mapped_column(ForeignKey("languages.id_language"))

    user: Mapped["User"] = relationship()
    language: Mapped["Language"] = relationship()