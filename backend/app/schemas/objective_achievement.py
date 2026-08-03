from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ObjectiveAchievementCreate(BaseModel):
    """Ce que le client envoie pour cocher un objectif.

    id_user n'y figure pas : il vient du token, jamais du formulaire.
    """

    id_learning_objective: int


class ObjectiveAchievementResponse(BaseModel):
    id_objective_achievement: int
    id_learning_objective: int
    achieved_at: datetime

    model_config = ConfigDict(from_attributes=True)