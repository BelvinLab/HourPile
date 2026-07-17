from pydantic import BaseModel,  ConfigDict
from app.models.enums import ProficiencyLevel 

# --- SCHÉMA DE CRÉATION ---
class UserLanguageCreate(BaseModel):  # Renommé pour éviter le conflit avec SQLAlchemy
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

    model_config = ConfigDict(from_attributes=True)