from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ProficiencyLevel


class StoryGenerate(BaseModel):
    """Ce que le client envoie pour demander une histoire."""

    id_language: int


class StoryResponse(BaseModel):
    id_story: int
    id_language: int
    title: str
    content: str
    level: ProficiencyLevel
    theme: str | None
    words_used: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)