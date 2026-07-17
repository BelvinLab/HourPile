from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from app.core.config import settings

def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode("utf-8")[:72]
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode("utf-8")  # Return as string

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode("utf-8")[:72]  # Fixed: should be 72
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)  # Fixed: checkpw not checkqw

# TOKENS JWT 

def create_access_token(subject: str | int) -> str:  # Fixed: access not acces
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> str | None:  # Fixed: access not acces
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])  # Fixed: algorithms as list
        return payload.get("sub")
    except jwt.PyJWTError:
        return None