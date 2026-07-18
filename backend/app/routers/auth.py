from fastapi import APIRouter,  Depends, HTTPException,status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db
from app.core.security import create_access_token
from app.schemas.user import UserCreate , UserResponse,UserLogin,Token
from app.services import user_services


router = APIRouter(prefix="/auth",tags=["auth"])

@router.post("/register",
              response_model=UserResponse,
              status_code=status.HTTP_201_CREATED
)
def register(data:UserCreate,db:Session=Depends(get_db)):
    try:
        user = user_services.create_user(db,data)
    except user_services.EmailAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un compte existe deja avec cet email.",
        )
    return user

@router.post("/login",response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(),db:Session=Depends(get_db)):
    user=user_services.authenticate_user(db,form_data.username,form_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
        )
    token=create_access_token(subject=user.id_user)
    return Token(access_token=token)