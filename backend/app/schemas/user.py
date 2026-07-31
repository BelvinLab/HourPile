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
    bio:str|None


# --- SCHÉMA DE RÉPONSE (ce que l'API renvoie) ---
class UserResponse(BaseModel):
    id_user: int
    first_name: str
    last_name: str
    email: EmailStr

    # str simple EN SORTIE : on renvoie ce qui est stocké, sans surprise
    avatar_url: str | None = None
    bio:str|None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type: str = "bearer" 

class UpdateUser(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    bio: str | None = Field(default=None, max_length=500)
    avatar_url: str | None = None