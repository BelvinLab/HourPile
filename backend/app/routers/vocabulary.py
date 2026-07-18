from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.get_current_user_deps import get_current_user
from app.models.vocabulary import Vocabulary
from app.schemas.vocabulary import VocabularyCreate, VocabularyResponse
from app.models.user import User
from app.services import vocabulary_services

router=APIRouter(prefix="/vocabulary",tags=["vocabulary"])
@router.post("/create",response_model=VocabularyResponse,status_code=201)
def create_vocabulary(
    data:VocabularyCreate,
    current_user:User=Depends(get_current_user),
    db:Session=Depends(get_db),
):
    return vocabulary_services.create_vocabulary(db,data,current_user.id_user)

@router.get("/my-vocabulary", response_model=list[VocabularyResponse])
def get_user_vocabulary(current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    return vocabulary_services.user_vocabulary(db,current_user.id_user)