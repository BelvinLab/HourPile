from sqlalchemy import String
from sqlalchemy.orm import Mapped,mapped_column

from app.core.database import Base

class Language(Base):
    __tablename__="languages"

    # attributs 

    id_language: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(60),nullable=False)
    code: Mapped[str] = mapped_column(String(2),nullable=False, unique=True)

    def __repr__(self)->str:
        return f"<languages {self.code} ({self.name})>"