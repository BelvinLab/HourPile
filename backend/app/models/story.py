from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import ProficiencyLevel


class Story(Base):
    """Une histoire courte générée à partir du vocabulaire de l'utilisateur.

    On la stocke pour éviter de régénérer (et de consommer du quota)
    à chaque relecture.
    """

    __tablename__ = "stories"

    id_story: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    id_language: Mapped[int] = mapped_column(ForeignKey("languages.id_language"))

    title: Mapped[str] = mapped_column(String(150))
    content: Mapped[str] = mapped_column(Text)
    level: Mapped[ProficiencyLevel] = mapped_column()
    # thème choisi par le LLM (voyage, travail, cuisine…)
    theme: Mapped[str | None] = mapped_column(String(60), nullable=True)
    # les mots effectivement employés, séparés par des virgules
    words_used: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())