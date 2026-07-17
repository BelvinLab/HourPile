from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

# --- SCHÉMA DE CRÉATION (Ce que le client envoie) ---
class LearningSessionCreate(BaseModel):
    # Attention : Le champ "activity" n'était pas dans ton modèle SQLAlchemy précédent !
    # Pense à l'ajouter dans ta base de données si ce n'est pas déjà fait.
    activity: str = Field(..., max_length=60)
    
    # Doit être un entier (ex: 30 minutes). ge=0 empêche les durées négatives.
    duration: int = Field(..., ge=0)
    
    # La langue ciblée par cette session de révision
    id_language: int
    
    # 💡 ASTUCE SÉCURITÉ : On n'inclut PAS id_user ici en général !
    # Un utilisateur malveillant pourrait envoyer "id_user": 2 pour modifier 
    # la session de quelqu'un d'autre. Tu récupéreras l'id_user directement 
    # depuis le Token de connexion (JWT) dans ta route FastAPI.
    
    # Optionnels : Le client n'est pas obligé de les envoyer
    note: str | None = Field(default=None, max_length=500)
    resource: str | None = Field(default=None, max_length=250)
    
    # Optionnel car ton modèle SQLAlchemy a "server_default=func.now()"
    # Si le client ne l'envoie pas, la base de données mettra la date du jour.
    session_date: datetime | None = Field(default=None)


# --- SCHÉMA DE RÉPONSE (Ce que l'API renvoie) ---
class LearningSessionResponse(BaseModel):
    id_session: int  # Ne pas oublier de renvoyer l'ID de la session !
    id_user: int     # On renvoie l'ID du propriétaire
    id_language: int # On renvoie l'ID de la langue
    
    activity: str
    duration: int
    session_date: datetime
    note: str | None
    resource: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)