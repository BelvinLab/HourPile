from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.language import Language


LANGUAGES=[
    ("en","Anglais"),
    ("fr","Francais"),
    ("it","Italien"),
    ("de","Allemand"),
    ("es","Espagnol")
]

def seed_languages()->None:
    session=SessionLocal()
    try:
        existing_code=set(session.scalars(select(Language.code)).all())
        created=0
        for code , name in LANGUAGES:
            if code in existing_code:
                continue
            session.add(Language(code=code,name=name))
            created+=1
        session.commit()
        print(f"Seed terminé: {created} langue(s) ajoutée(s), {len(existing_code)} déjà présente(s).")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

if __name__== "__main__":
    seed_languages()