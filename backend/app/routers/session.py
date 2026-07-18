from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.get_current_user_deps import get_current_user
from app.models.learning_session import LearningSession
from app.schemas.learning_session import LearningSessionResponse,LearningSessionCreate
from app.models.user import User
from app.services import session_services
router =APIRouter(prefix="/session",tags=["session"])

@router.post("/create",response_model=LearningSessionResponse,status_code=201)
def create_session(
    data:LearningSessionCreate,
    current_user: User=Depends(get_current_user),
    db:Session=Depends(get_db),
):
    return session_services.create_session(db,data,current_user.id_user)    

@router.get("/my_session",response_model=list[LearningSessionResponse])
def get_user_session(current_user=Depends(get_current_user), db: Session=Depends(get_db)):
    return session_services.user_sessions(db,current_user.id_user)