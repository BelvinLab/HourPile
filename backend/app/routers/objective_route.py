from fastapi import APIRouter,Depends,status,HTTPException
from sqlalchemy.orm import Session
from app.schemas.learning_objective import LearningObjectiveResponse
from app.schemas.objective_achievement import ObjectiveAchievementResponse
from app.services import objective_services
from app.core.database import get_db
from app.dependencies.get_current_user_deps import get_current_user

router = APIRouter(prefix="/objective", tags=["Objective"])

@router.get("/achieved",response_model=list[ObjectiveAchievementResponse])
def get_user_achievement(db:Session=Depends(get_db),current_user=Depends(get_current_user)):
    return objective_services.get_user_achievement(db,current_user.id_user)

@router.get("/{id_language}",response_model=list[LearningObjectiveResponse])
def get_all_objective(id_language:int,db:Session=Depends(get_db)):
    return objective_services.get_objective_by_language(db,id_language)


@router.post("/achievement/{id_learning_objective}", response_model=ObjectiveAchievementResponse)
def add_new_achievement(id_learning_objective:int,db:Session=Depends(get_db),current_user=Depends(get_current_user)):
    try:
        return objective_services.add_achieved_objective(db,current_user.id_user,id_learning_objective)
    except objective_services.AchievedObjectiveIsAlreadyAdd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'objetif a deja ete mentionner commme atteint"
        )

@router.delete("/achievement/{id_learning_objective}",status_code=status.HTTP_204_NO_CONTENT)
def remove_achieved_objective(
    id_learning_objective:int,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user),
   ):

    try:
        objective_services.remove_achieved_objective(db,current_user.id_user,id_learning_objective)
    except objective_services.AchievedObjectiveNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Objectif non trouvé"
        )