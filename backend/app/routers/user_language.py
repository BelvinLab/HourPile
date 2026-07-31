from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.get_current_user_deps import get_current_user
from app.models.user import User
from app.schemas.user_language import (
    UserLanguageCreate,
    UserLanguageResponse,
    UserLanguageUpdate,
)
from app.services import user_language_service

router = APIRouter(prefix="/user-languages", tags=["user-languages"])


@router.get("/me", response_model=list[UserLanguageResponse])
def get_my_languages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return user_language_service.get_user_languages(db, current_user.id_user)


@router.post("", response_model=UserLanguageResponse, status_code=status.HTTP_201_CREATED)
def declare_language(
    data: UserLanguageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return user_language_service.declare_user_language(
            db, data, current_user.id_user
        )
    except user_language_service.LanguageAlreadyDeclared:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette langue est déjà déclarée.",
        )


@router.patch("/{id_user_language}", response_model=UserLanguageResponse)
def update_language(
    id_user_language: int,
    data: UserLanguageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated = user_language_service.update_user_language(
        db, id_user_language, current_user.id_user, data
    )
    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Langue non trouvée.",
        )
    return updated

@router.delete("/{id_user_language}", status_code=status.HTTP_204_NO_CONTENT)
def delete_language(
    id_user_language: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = user_language_service.delete_user_language(
        db, id_user_language, current_user.id_user
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Langue non trouvée.",
        )