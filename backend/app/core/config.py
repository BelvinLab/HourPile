from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Charge la configuration depuis les variables d'environnement."""

    DATABASE_URL: str
    APP_NAME: str = "HourPile API"

    # --- Sécurité / JWT ---
    # Aucune valeur par défaut : l'app refuse de démarrer si la clé n'est
    # pas fournie. En production, une clé par défaut connue permettrait
    # à quiconque de forger des tokens valides.
    SECRET_KEY: str

    # Algorithme de signature. HS256 = standard, symétrique, suffisant ici.
    ALGORITHM: str = "HS256"

    # Durée de validité d'un token, en minutes (ici 24h).
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Origines autorisées par CORS, séparées par des virgules
    CORS_ORIGINS: str = "http://localhost:5173"

    @field_validator("DATABASE_URL")
    @classmethod
    def force_psycopg_driver(cls, v: str) -> str:
        """Railway fournit 'postgresql://', SQLAlchemy attend
        'postgresql+psycopg://'. On normalise pour que les deux
        environnements fonctionnent sans intervention."""
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()