from datetime import datetime

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.learning_objective import LearningObjective


class ObjectiveAchievement(Base):
    """Marque qu'un utilisateur a validé un objectif d'apprentissage.

    La présence de la ligne signifie « acquis » : cocher crée la ligne,
    décocher la supprime. Pas besoin de booléen.
    """

    __tablename__ = "objective_achievements"
    __table_args__ = (
        UniqueConstraint(
            "id_user", "id_learning_objective", name="uq_user_objective"
        ),
    )

    id_objective_achievement: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    id_learning_objective: Mapped[int] = mapped_column(
        ForeignKey("learning_objectives.id_learning_objective")
    )
    achieved_at: Mapped[datetime] = mapped_column(server_default=func.now())

    learning_objective: Mapped[LearningObjective] = relationship()