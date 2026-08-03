from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.objective_achievement import ObjectiveAchievement
from app.models.learning_objective import LearningObjective

class AchievedObjectiveIsAlreadyAdd(Exception):
    """ l'utilisateur a deja cette objectif accomplir"""

class AchievedObjectiveNotExist(Exception):
    """ L'objectif en question n'existe pas pour l'utilisateur n'est pas le proprietaire"""

def get_objective_by_language(db:Session,id_language:int)->list[LearningObjective]:
    res= select(LearningObjective).where(LearningObjective.id_language==id_language).order_by(LearningObjective.level,LearningObjective.position)
    return list(db.scalars(res).all())

def get_user_achievement(db:Session,id_user:int)->list[ObjectiveAchievement]:
    res = select(ObjectiveAchievement).where(ObjectiveAchievement.id_user==id_user)
    return list(db.scalars(res).all())

def add_achieved_objective(db:Session,id_user:int, id_learning_objective:int)->ObjectiveAchievement:
    existing= db.scalars(select(ObjectiveAchievement).where(ObjectiveAchievement.id_user==id_user,
                                                  ObjectiveAchievement.id_learning_objective==id_learning_objective)).first()

    if existing:
        raise AchievedObjectiveIsAlreadyAdd()
    new_achievement= ObjectiveAchievement(id_user=id_user, id_learning_objective=id_learning_objective)

    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)
    return new_achievement


def remove_achieved_objective(db:Session,id_user:int, id_learning_objective:int):
    existing= db.scalars(select(ObjectiveAchievement).where(ObjectiveAchievement.id_learning_objective==id_learning_objective,
                                                ObjectiveAchievement.id_user==id_user)).first()

    if not existing:
        raise AchievedObjectiveNotExist()

    db.delete(existing)
    db.commit()
    return True
