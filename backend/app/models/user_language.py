from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

from app.models.user import User
from app.models.language import Language

class UserLanguage(Base):
    __tablename__ = "user_languages"

    # La bonne pratique pour une table d'association est souvent de s'assurer
    # qu'un utilisateur ne peut pas avoir deux fois la même langue.
    __table_args__ = (
        UniqueConstraint("id_user", "id_language", name="unique_user_language"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    
    # Précision du type String pour la BDD (ex: "A1", "B2", "C1")
    # Optionnel (str | None) au cas où l'utilisateur ne connaît pas encore son niveau
    current_level: Mapped[str | None] = mapped_column(String(20), default=None)
    target_level: Mapped[str | None] = mapped_column(String(20), default=None)
    
    # ==========================================
    # 1. LES CLÉS ÉTRANGÈRES
    # ==========================================
    # Associe la progression à l'utilisateur
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    
    # Associe la progression à la langue
    id_language: Mapped[int] = mapped_column(ForeignKey("languages.id_language"))

    # ==========================================
    # 2. LES RELATIONS
    # ==========================================
    user: Mapped["User"] = relationship()
    language: Mapped["Language"] = relationship()