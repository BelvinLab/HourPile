from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.language import Language

def get_all_languages(db:Session)->list[Language]:
    res = select(Language).order_by(Language.name)
    return list(db.scalars(res).all())