from sqlalchemy import select 
from sqlalchemy.orm import Session
from app.models.vocabulary import Vocabulary
from app.schemas.vocabulary import VocabularyCreate, VocabularyResponse

def create_vocabulary(db:Session,data:VocabularyCreate,id_user:int)->Vocabulary:
    vocabulary=Vocabulary(
        id_language=data.id_language,
        id_user=id_user,
        word=data.word,
        translation=data.translation,
        definition=data.definition,
        example=data.example,
        category=data.category

    )
    db.add(vocabulary)
    db.commit()
    db.refresh(vocabulary)
    return vocabulary

def user_vocabulary(db:Session,id_user:int)->list[Vocabulary]:
    res=select(Vocabulary).where(Vocabulary.id_user==id_user)
    return list(db.scalars(res).all())