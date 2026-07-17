from datetime import datetime
from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class User(Base):
    __tablename__  = "users"

    id_user: Mapped[int] = mapped_column(primary_key=True)
    
    # 1. Utilisation de "str" au lieu de "String" dans Mapped
    # 2. Utilisation de "str | None" pour indiquer automatiquement nullable=True
    first_name: Mapped[str | None] = mapped_column(String(60))
    last_name: Mapped[str | None] = mapped_column(String(60))
    
    email: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(250))
    
    # J'ai passé la bio et l'avatar en optionnel (str | None) car c'est généralement le cas
    bio: Mapped[str | None] = mapped_column(String(500))
    avatar_url: Mapped[str | None] = mapped_column(String(500), default=None)
    
    # 3. func.now() s'écrit sans instancier func().tz n'est pas standard ici.
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    
    # Ajout de onupdate pour que la date se mette à jour toute seule à chaque modification
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), 
        onupdate=func.now()
    )