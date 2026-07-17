from pydantic import BaseModel, ConfigDict, Field

# --- SCHÉMA DE CRÉATION ---
class VocabularyCreate(BaseModel):
    id_language: int  
    word: str = Field(..., max_length=60)  # CORRIGÉ : max_length
    translation: str = Field(..., max_length=60)
    definition: str | None = Field(default=None, max_length=500)
    example: str | None = Field(default=None, max_length=500)
    category: str | None = Field(default=None, max_length=60)


# --- SCHÉMA DE RÉPONSE ---
class VocabularyResponse(BaseModel):
    id_vocabulary: int
    id_user: int
    id_language: int
    word: str
    translation: str 
    definition: str | None
    example: str | None
    category: str | None

    model_config = ConfigDict(from_attributes=True)