from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


from app.models.user import User
from app.models.language import Language

class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id_vocabulary: Mapped[int] = mapped_column(primary_key=True)
    word: Mapped[str] = mapped_column(String(60))
    translation: Mapped[str] = mapped_column(String(60))
    
    # J'ai passé la définition, l'exemple et la catégorie en optionnels (str | None) 
    # car un utilisateur n'a pas toujours de définition ou d'exemple sous la main.
    definition: Mapped[str | None] = mapped_column(String(500), default=None)
    example: Mapped[str | None] = mapped_column(String(500), default=None)
    category: Mapped[str | None] = mapped_column(String(60), default=None)

    # ==========================================
    # 1. LES CLÉS ÉTRANGÈRES (Colonnes SQL réelles)
    # ==========================================
    # Associe le vocabulaire à l'utilisateur de la table "users" (clé "id_user")
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    
    # Associe le vocabulaire à la langue de la table "languages" (clé "id_language")
    id_language: Mapped[int] = mapped_column(ForeignKey("languages.id_language"))

    # ==========================================
    # 2. LES RELATIONS (Raccourcis Python / ORM)
    # ==========================================
    # Permet de faire : mon_vocabulaire.user pour obtenir l'objet User complet
    user: Mapped["User"] = relationship()
    
    # Permet de faire : mon_vocabulaire.language pour obtenir la langue associée
    language: Mapped["Language"] = relationship()