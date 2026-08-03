"""Peuple le référentiel des objectifs d'apprentissage.

Usage : python -m scripts.seed_learning_objectives

Le script est idempotent : relancer ne crée pas de doublons, il ajoute
seulement ce qui manque. La clé d'unicité est (id_language, level, title).
"""

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.language import Language
from app.models.learning_objective import LearningObjective

# Code ISO de la langue concernée
LANGUAGE_CODE = "en"

# (level, category, title, description)
OBJECTIVES = [
    # ---------- GRAMMAIRE ----------
    ("A1", "grammar", "Le présent simple",
     "Formes affirmative, négative et interrogative. Le -s de la 3e personne."),
    ("A1", "grammar", "Le verbe to be",
     "Présent : am / is / are, contractions, formes négatives."),
    ("A1", "grammar", "Le verbe to have (got)",
     "Exprimer la possession, formes contractées."),
    ("A1", "grammar", "Les articles a, an, the",
     "Article indéfini devant voyelle ou consonne, article défini."),
    ("A1", "grammar", "Le pluriel des noms",
     "Pluriels réguliers en -s / -es et principaux irréguliers."),
    ("A1", "grammar", "Les pronoms personnels sujets",
     "I, you, he, she, it, we, they."),
    ("A1", "grammar", "Les adjectifs possessifs",
     "My, your, his, her, its, our, their."),
    ("A1", "grammar", "Les démonstratifs",
     "This, that, these, those."),
    ("A1", "grammar", "There is / there are",
     "Décrire l'existence et la présence."),
    ("A1", "grammar", "Le présent continu (be + -ing)",
     "Parler de ce qui se passe au moment où l'on parle."),
    ("A1", "grammar", "Can pour la capacité",
     "I can swim, I can't drive."),
    ("A1", "grammar", "Les prépositions de lieu",
     "In, on, at, under, next to, between."),
    ("A1", "grammar", "Les prépositions de temps",
     "At (heure), on (jour), in (mois, année)."),
    ("A1", "grammar", "Les adverbes de fréquence",
     "Always, usually, often, sometimes, never — et leur place dans la phrase."),
    ("A1", "grammar", "Les mots interrogatifs",
     "What, where, when, who, how, why, how much / how many."),
    ("A1", "grammar", "L'impératif",
     "Donner un ordre, une consigne, une direction."),

    # ---------- VOCABULAIRE ----------
    ("A1", "vocabulary", "Les nombres de 1 à 100",
     "Cardinaux et ordinaux de base."),
    ("A1", "vocabulary", "Les jours, mois et saisons", None),
    ("A1", "vocabulary", "L'heure et les moments de la journée",
     "Dire l'heure, morning / afternoon / evening / night."),
    ("A1", "vocabulary", "La famille et les relations proches", None),
    ("A1", "vocabulary", "Les couleurs et les formes", None),
    ("A1", "vocabulary", "Le corps humain", None),
    ("A1", "vocabulary", "Les vêtements", None),
    ("A1", "vocabulary", "La nourriture et les boissons courantes", None),
    ("A1", "vocabulary", "La maison et les pièces", None),
    ("A1", "vocabulary", "Les objets du quotidien", None),
    ("A1", "vocabulary", "Les métiers courants", None),
    ("A1", "vocabulary", "Les lieux de la ville",
     "Shop, station, bank, hospital, school…"),
    ("A1", "vocabulary", "Les pays et nationalités", None),
    ("A1", "vocabulary", "La météo de base", None),
    ("A1", "vocabulary", "Les activités quotidiennes",
     "Get up, have breakfast, go to work, watch TV…"),
    ("A1", "vocabulary", "Les adjectifs de description courants",
     "Big, small, old, new, good, bad, happy…"),

    # ---------- COMPÉTENCES ----------
    ("A1", "skill", "Se présenter",
     "Nom, âge, nationalité, profession, lieu d'habitation."),
    ("A1", "skill", "Saluer et prendre congé",
     "Formules courantes selon le moment et le degré de familiarité."),
    ("A1", "skill", "Épeler son nom et comprendre un mot épelé", None),
    ("A1", "skill", "Demander et donner des informations personnelles",
     "Numéro de téléphone, adresse, email."),
    ("A1", "skill", "Commander dans un café ou un restaurant", None),
    ("A1", "skill", "Faire des achats simples",
     "Demander un prix, une taille, payer."),
    ("A1", "skill", "Demander et indiquer son chemin", None),
    ("A1", "skill", "Décrire sa routine quotidienne", None),
    ("A1", "skill", "Parler de ses goûts",
     "I like / I don't like / I love + nom ou -ing."),
    ("A1", "skill", "Remplir un formulaire simple", None),
    ("A1", "skill", "Comprendre des consignes courtes et claires", None),
    ("A1", "skill", "Écrire un message court",
     "Carte postale, SMS, note simple."),

    # ---------- PHONÉTIQUE ----------
    ("A1", "phonetics", "L'alphabet anglais", None),
    ("A1", "phonetics", "Les sons voyelles courts et longs",
     "Distinguer ship / sheep, full / fool."),
    ("A1", "phonetics", "Le son TH",
     "Distinguer think (sourd) et this (sonore)."),
    ("A1", "phonetics", "L'accent tonique dans les mots courants", None),
]


def seed_objectives() -> None:
    db = SessionLocal()
    try:
        language = db.scalars(
            select(Language).where(Language.code == LANGUAGE_CODE)
        ).first()

        if language is None:
            print(f"Langue '{LANGUAGE_CODE}' introuvable. Lance d'abord le seed des langues.")
            return

        created = 0
        skipped = 0

        for position, (level, category, title, description) in enumerate(OBJECTIVES, start=1):
            existing = db.scalars(
                select(LearningObjective).where(
                    LearningObjective.id_language == language.id_language,
                    LearningObjective.level == level,
                    LearningObjective.title == title,
                )
            ).first()

            if existing:
                skipped += 1
                continue

            db.add(
                LearningObjective(
                    id_language=language.id_language,
                    level=level,
                    category=category,
                    title=title,
                    description=description,
                    position=position,
                )
            )
            created += 1

        db.commit()
        print(f"{created} objectif(s) créé(s), {skipped} déjà présent(s).")
    finally:
        db.close()


if __name__ == "__main__":
    seed_objectives()