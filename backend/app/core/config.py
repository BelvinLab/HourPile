from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Charge la configuration depuis les variables d'environnement."""

    DATABASE_URL: str
    APP_NAME: str = "HourPile API"

    # --- Sécurité / JWT ---
    # SECRET_KEY : clé utilisée pour SIGNER les tokens. Elle doit rester
    # secrète (dans le .env) et être longue/aléatoire en production.
    # Si elle fuite, n'importe qui peut forger de faux tokens.
    SECRET_KEY: str = "dev_secret_a_changer_en_prod"

    # Algorithme de signature. HS256 = standard, symétrique, suffisant ici.
    ALGORITHM: str = "HS256"

    # Durée de validité d'un token, en minutes (ici 24h).
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()