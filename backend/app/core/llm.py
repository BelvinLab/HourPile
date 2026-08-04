import json

import httpx

from app.core.config import settings

API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{settings.LLM_MODEL}:generateContent"
)


class LLMError(Exception):
    """L'appel au modèle a échoué."""


async def generate_json(prompt: str, timeout: float = 30.0) -> dict:
    """Envoie un prompt et attend une réponse JSON."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.9,
            "responseMimeType": "application/json",
        },
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                API_URL,
                params={"key": settings.LLM_API_KEY},
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPStatusError as exc:
        # le corps de la réponse contient le message d'erreur de Google
        raise LLMError(
            f"HTTP {exc.response.status_code} : {exc.response.text[:300]}"
        ) from exc
    except httpx.HTTPError as exc:
        raise LLMError(f"Appel au modèle impossible : {exc}") from exc

    try:
        raw = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as exc:
        raise LLMError("Réponse du modèle inattendue.") from exc

    # on nettoie d'éventuelles balises Markdown
    cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```")

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise LLMError("Le modèle n'a pas renvoyé de JSON valide.") from exc