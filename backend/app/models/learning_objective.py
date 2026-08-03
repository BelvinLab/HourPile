from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import ProficiencyLevel


class LearningObjective(Base):
    """Une notion à maîtriser pour atteindre un niveau donné.

    Référentiel commun à tous les utilisateurs, rempli par un script
    de seed. La colonne id_language est prévue dès maintenant même si
    seul l'anglais est renseigné au départ.
    """

    __tablename__ = "learning_objectives"

    id_learning_objective: Mapped[int] = mapped_column(primary_key=True)
    id_language: Mapped[int] = mapped_column(ForeignKey("languages.id_language"))

    level: Mapped[ProficiencyLevel] = mapped_column()
    # grammar | vocabulary | skill | phonetics
    category: Mapped[str] = mapped_column(String(30))
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(String(300), nullable=True)
    # ordre d'affichage à l'intérieur d'un niveau
    position: Mapped[int] = mapped_column()