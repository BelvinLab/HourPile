from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.llm import LLMError, generate_json
from app.models.story import Story
from app.models.vocabulary import Vocabulary

# On propose ce nombre de mots au modèle, il en retiendra une partie
CANDIDATE_WORDS = 40
# Limite quotidienne par utilisateur, pour ne pas épuiser le quota
DAILY_LIMIT = 5


class NotEnoughWords(Exception):
    """L'utilisateur n'a pas assez de vocabulaire pour générer une histoire."""


class DailyLimitReached(Exception):
    """L'utilisateur a atteint sa limite quotidienne de générations."""


def _build_prompt(words: list[Vocabulary], level: str, language_name: str) -> str:
    """Construit la consigne envoyée au modèle."""
    word_list = "\n".join(
        f"- {w.word} ({w.translation})" for w in words
    )

    return f"""Tu es professeur de {language_name}.

Voici le vocabulaire récent d'un apprenant de niveau {level} :
{word_list}

Ta tâche :
1. Choisis entre 8 et 12 mots de cette liste qui peuvent partager un
   contexte cohérent (voyage, travail, cuisine, ville, école, santé…).
   Ignore les mots qui ne s'intègrent pas naturellement.
2. Écris une histoire courte en {language_name}, de 150 à 250 mots,
   adaptée au niveau {level} du CECRL.
3. Emploie chaque mot retenu au moins une fois, de façon naturelle.
   L'histoire doit se lire comme un vrai texte, pas comme un exercice.
4. Donne un titre court.

Contraintes de niveau {level} : utilise des structures et un vocabulaire
accessibles à ce niveau. N'introduis pas de tournures trop complexes.

Réponds uniquement avec cet objet JSON :
{{
  "title": "le titre",
  "theme": "le thème en un mot",
  "content": "le texte de l'histoire",
  "words_used": ["mot1", "mot2"]
}}"""


def _count_today(db: Session, id_user: int) -> int:
    """Nombre d'histoires générées aujourd'hui par cet utilisateur."""
    start_of_day = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    stmt = select(Story).where(
        Story.id_user == id_user,
        Story.created_at >= start_of_day,
    )
    return len(list(db.scalars(stmt).all()))


def get_user_stories(db: Session, id_user: int) -> list[Story]:
    stmt = (
        select(Story)
        .where(Story.id_user == id_user)
        .order_by(Story.created_at.desc())
    )
    return list(db.scalars(stmt).all())


async def generate_story(
    db: Session,
    id_user: int,
    id_language: int,
    language_name: str,
    level: str,
) -> Story:
    """Génère une histoire à partir du vocabulaire récent de l'utilisateur."""

    if _count_today(db, id_user) >= DAILY_LIMIT:
        raise DailyLimitReached()

    # les mots les plus récents pour cette langue
    stmt = (
        select(Vocabulary)
        .where(
            Vocabulary.id_user == id_user,
            Vocabulary.id_language == id_language,
        )
        .order_by(Vocabulary.created_at.desc())
        .limit(CANDIDATE_WORDS)
    )
    words = list(db.scalars(stmt).all())

    if len(words) < 8:
        raise NotEnoughWords()

    prompt = _build_prompt(words, level, language_name)
    result = await generate_json(prompt)

    # on valide ce que le modèle a renvoyé avant de l'enregistrer
    title = result.get("title")
    content = result.get("content")
    if not title or not content:
        raise LLMError("Le modèle n'a pas renvoyé d'histoire exploitable.")

    story = Story(
        id_user=id_user,
        id_language=id_language,
        title=title[:150],
        content=content,
        level=level,
        theme=(result.get("theme") or None),
        words_used=",".join(result.get("words_used", [])),
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    return story