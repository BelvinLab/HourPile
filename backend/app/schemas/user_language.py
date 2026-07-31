from pydantic import BaseModel,  ConfigDict
from app.models.enums import ProficiencyLevel 
from app.schemas.language import LanguageRead

# --- SCHÉMA DE CRÉATION ---
class UserLanguageCreate(BaseModel):  
    id_language: int 
    
   
    current_level: ProficiencyLevel
    target_level: ProficiencyLevel
    
    # Parfait : id_user sera injecté par le routeur FastAPI (via le Token)


# --- SCHÉMA DE RÉPONSE ---
class UserLanguageResponse(BaseModel):
    id: int
    id_user: int
    id_language: int
    current_level: ProficiencyLevel
    target_level: ProficiencyLevel
    language: LanguageRead
    model_config = ConfigDict(from_attributes=True)

class UserLanguageUpdate(BaseModel):
    current_level: ProficiencyLevel | None = None
    target_level: ProficiencyLevel | None = None