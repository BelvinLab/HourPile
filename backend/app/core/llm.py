import asyncio
import json

import httpx

from app.core.config import settings

API_URL = "https://api.groq.com/openai/v1/chat/completions"


class LLMError(Exception):
    """L'appel au modèle a échoué."""


async def generate_json(
    prompt: str, timeout: float = 30.0, retries: int = 3
) -> dict:
    """Envoie un prompt et attend une réponse JSON."""
    payload = {
        "model": settings.LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.9,
        # force une sortie JSON valide
        "response_format": {"type": "json_object"},
    }
    headers = {"Authorization": f"Bearer {settings.LLM_API_KEY}"}

    last_error = None

    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(API_URL, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
            break
        except httpx.HTTPStatusError as exc:
            # 429 et 503 sont temporaires : on réessaie. Le reste est définitif.
            if exc.response.status_code not in (429, 503):
                raise LLMError(
                    f"HTTP {exc.response.status_code} : {exc.response.text[:300]}"
                ) from exc
            last_error = exc
            await asyncio.sleep(2**attempt)
        except httpx.HTTPError as exc:
            last_error = exc
            await asyncio.sleep(2**attempt)
    else:
        raise LLMError(f"Modèle indisponible après {retries} tentatives : {last_error}")

    try:
        raw = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as exc:
        raise LLMError("Réponse du modèle inattendue.") from exc

    cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```")

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise LLMError("Le modèle n'a pas renvoyé de JSON valide.") from exc