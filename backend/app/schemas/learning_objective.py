from pydantic import BaseModel, ConfigDict

from app.models.enums import ProficiencyLevel


class LearningObjectiveResponse(BaseModel):
    """Un objectif du référentiel, tel que renvoyé par l'API."""

    id_learning_objective: int
    id_language: int
    level: ProficiencyLevel
    category: str
    title: str
    description: str | None
    position: int

    model_config = ConfigDict(from_attributes=True)