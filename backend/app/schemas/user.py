from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, Field, HttpUrl


# --- SCHÉMA DE CRÉATION (ce que le client envoie) ---
class UserCreate(BaseModel):
    first_name: str = Field(..., max_length=60)
    last_name: str = Field(..., max_length=60)
    email: EmailStr = Field(..., max_length=60)
    password: str = Field(..., min_length=8, max_length=72)  # 72 = limite bcrypt

    # HttpUrl valide strictement le lien EN ENTRÉE
    avatar_url: HttpUrl | None = Field(default=None)


# --- SCHÉMA DE RÉPONSE (ce que l'API renvoie) ---
class UserResponse(BaseModel):
    id_user: int
    first_name: str
    last_name: str
    email: EmailStr

    # str simple EN SORTIE : on renvoie ce qui est stocké, sans surprise
    avatar_url: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type: str = "bearer" 