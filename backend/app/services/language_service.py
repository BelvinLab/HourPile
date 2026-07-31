from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.language import Language
from app.models.user_language import UserLanguage
from app.schemas.user_language import UserLanguageCreate, UserLanguageResponse

def get_all_languages(db:Session)->list[Language]:
    res = select(Language).order_by(Language.name)
    return list(db.scalars(res).all())


