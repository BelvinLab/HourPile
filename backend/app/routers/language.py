from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.language import LanguageRead  
from app.services import language_service

router = APIRouter(prefix="/languages", tags=["languages"])


@router.get("", response_model=list[LanguageRead])
def list_languages(db: Session = Depends(get_db)):
    """Référentiel public : pas besoin d'être connecté pour lister les langues."""
    return language_service.get_all_languages(db)