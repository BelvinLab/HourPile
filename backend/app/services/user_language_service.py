from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_language import UserLanguage
from app.schemas.user_language import UserLanguageCreate, UserLanguageUpdate


class LanguageAlreadyDeclared(Exception):
    """L'utilisateur a déjà déclaré cette langue."""


def get_user_languages(db: Session, id_user: int) -> list[UserLanguage]:
    """Toutes les langues déclarées par un utilisateur."""
    stmt = select(UserLanguage).where(UserLanguage.id_user == id_user)
    return list(db.scalars(stmt).all())


def declare_user_language(
    db: Session, data: UserLanguageCreate, id_user: int
) -> UserLanguage:
    """Déclare une nouvelle langue pour l'utilisateur.

    Lève LanguageAlreadyDeclared si la langue est déjà déclarée — on
    vérifie en amont plutôt que de laisser la contrainte d'unicité
    remonter une IntegrityError illisible.
    """
    existing = db.scalars(
        select(UserLanguage).where(
            UserLanguage.id_user == id_user,
            UserLanguage.id_language == data.id_language,
        )
    ).first()
    if existing:
        raise LanguageAlreadyDeclared()

    user_language = UserLanguage(
        id_language=data.id_language,
        current_level=data.current_level,
        target_level=data.target_level,
        id_user=id_user,
    )
    db.add(user_language)
    db.commit()
    db.refresh(user_language)
    return user_language


def update_user_language(
    db: Session, id: int, id_user: int, data: UserLanguageUpdate
) -> UserLanguage | None:
    """Met à jour le niveau actuel et/ou le niveau cible.

    Renvoie None si la ligne n'existe pas OU n'appartient pas à
    l'utilisateur — la route traduit les deux cas en 404.
    """
    user_language = db.scalars(
        select(UserLanguage).where(
            UserLanguage.id == id,
            UserLanguage.id_user == id_user,
        )
    ).first()
    if user_language is None:
        return None

    # exclude_unset : on ne touche qu'aux champs réellement envoyés.
    # Sans ça, un PATCH ne fournissant que current_level écraserait
    # target_level à None.
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user_language, field, value)

    db.commit()
    db.refresh(user_language)
    return user_language


def delete_user_language(db: Session, id_user_language: int, id_user: int) -> bool:
    """Retire une langue déclarée. Renvoie False si introuvable.

    Note : les sessions et le vocabulaire liés à cette langue ne sont
    PAS supprimés — ils restent dans l'historique.
    """
    user_language = db.scalars(
        select(UserLanguage).where(
            UserLanguage.id == id_user_language,
            UserLanguage.id_user == id_user,
        )
    ).first()
    if user_language is None:
        return False

    db.delete(user_language)
    db.commit()
    return True