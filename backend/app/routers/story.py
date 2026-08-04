from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.llm import LLMError
from app.dependencies.get_current_user_deps import get_current_user
from app.models.user import User
from app.models.user_language import UserLanguage
from app.schemas.story import StoryGenerate, StoryResponse
from app.services import story_services

router = APIRouter(prefix="/stories", tags=["stories"])


@router.get("", response_model=list[StoryResponse])
def list_my_stories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return story_services.get_user_stories(db, current_user.id_user)


@router.post("", response_model=StoryResponse, status_code=status.HTTP_201_CREATED)
async def generate_story(
    data: StoryGenerate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # On récupère la déclaration de langue : elle porte le niveau,
    # et sa relation donne le nom de la langue.
    user_language = db.scalars(
        select(UserLanguage).where(
            UserLanguage.id_user == current_user.id_user,
            UserLanguage.id_language == data.id_language,
        )
    ).first()

    if user_language is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Déclare cette langue dans ton profil avant de générer une histoire.",
        )

    try:
        return await story_services.generate_story(
            db=db,
            id_user=current_user.id_user,
            id_language=data.id_language,
            language_name=user_language.language.name,
            level=user_language.current_level or "A2",
        )
    except story_services.NotEnoughWords:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ajoute au moins 8 mots dans cette langue pour générer une histoire.",
        )
    except story_services.DailyLimitReached:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Limite quotidienne atteinte. Reviens demain.",
        )
    except LLMError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La génération a échoué. Réessaie dans un instant.",
        )