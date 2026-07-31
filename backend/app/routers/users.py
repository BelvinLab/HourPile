from fastapi import APIRouter, Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.dependencies.get_current_user_deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse,UpdateUser
from app.core.database import get_db
from app.services import user_services

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_user(
    data: UpdateUser,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated = user_services.user_update(db, current_user.id_user, data)
    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé",
        )
    return updated