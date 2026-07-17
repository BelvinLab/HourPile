from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


class EmailAlreadyExists(Exception):
    """Exception levée quand on tente de créer un utilisateur avec un email existant."""
    def __init__(self, email: str):
        self.email = email
        self.message = f"L'email {email} est déjà utilisé."
        super().__init__(self.message)


def get_user_by_email(db: Session, email: str) -> User | None:
    res = select(User).where(User.email == email)
    return db.scalars(res).first()


def create_user(db: Session, data: UserCreate) -> User:
    if get_user_by_email(db, data.email) is not None:
        raise EmailAlreadyExists(data.email)

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        # On ne stocke SURTOUT PAS le data.password en clair !
        hashed_password=hash_password(data.password),
        avatar_url=str(data.avatar_url) if data.avatar_url else None,
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    
    if user is None:
        return None
        
    if not verify_password(password, user.hashed_password):
        return None
        
    return user