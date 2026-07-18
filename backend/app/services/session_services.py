from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.learning_session import LearningSession
from app.schemas.learning_session import LearningSessionCreate,LearningSessionResponse

def create_session(db: Session,data:LearningSessionCreate,id_user:int)->LearningSession:
    session_learning=LearningSession(
        activity = data.activity,
        duration= data.duration,
        note=data.note,
        id_user=id_user,
        id_language=data.id_language,
        resource=data.resource
    )

    db.add(session_learning)
    db.commit()
    db.refresh(session_learning)

    return session_learning
def user_sessions(db:Session,id_user:int)->list[LearningSession]:
    res=select(LearningSession).where(LearningSession.id_user==id_user)
    return list(db.scalars(res).all())
