from pydantic import BaseModel, ConfigDict, Field

class LanguageBase(BaseModel):
    # les "..." signifient que le champ est obligatoire
    # max_length/min_length : validation automatique de la longueur    
    nom: str = Field(...,max_length=60)
    code: str = Field(...,min_length=2,max_length=2)

class LanguageCreate(LanguageBase):
    pass

class LanguageRead(LanguageBase):
    id_language: int

    model_config=ConfigDict(from_attributes=True)