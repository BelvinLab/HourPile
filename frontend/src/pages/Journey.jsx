import { useState, useEffect, useCallback } from "react";
import { Check, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyLanguages } from "../api/userLanguageService";
import {
  getAllObjectives,
  getMyAchievements,
  achieveObjective,
  unachieveObjective,
} from "../api/objectiveService";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const CATEGORY_LABELS = {
  grammar: "Grammaire",
  vocabulary: "Vocabulaire",
  skill: "Compétences",
  phonetics: "Phonétique",
};

function Journey() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [objectives, setObjectives] = useState([]);
  // Set des id d'objectifs cochés : test d'appartenance instantané
  const [achieved, setAchieved] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Charger les langues déclarées, sélectionner la première
  useEffect(() => {
    getMyLanguages()
      .then((data) => {
        setLanguages(data);
        if (data.length) setSelectedLanguage(data[0].language.id_language);
      })
      .catch(() => setError("Impossible de charger tes langues."))
      .finally(() => setLoading(false));
  }, []);

  // 2. Charger le référentiel et la progression pour la langue choisie
  const loadObjectives = useCallback(() => {
    if (!selectedLanguage) return;

    Promise.all([getAllObjectives(selectedLanguage), getMyAchievements()])
      .then(([objectivesData, achievementsData]) => {
        setObjectives(objectivesData);
        setAchieved(
          new Set(achievementsData.map((a) => a.id_learning_objective))
        );
      })
      .catch(() => setError("Impossible de charger le parcours."));
  }, [selectedLanguage]);

  useEffect(() => {
    loadObjectives();
  }, [loadObjectives]);

  async function toggle(id) {
    const wasAchieved = achieved.has(id);

    // mise à jour optimiste : on coche tout de suite, on corrige si l'API échoue
    setAchieved((prev) => {
      const next = new Set(prev);
      wasAchieved ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      if (wasAchieved) {
        await unachieveObjective(id);
      } else {
        await achieveObjective(id);
      }
    } catch {
      // rollback
      setAchieved((prev) => {
        const next = new Set(prev);
        wasAchieved ? next.add(id) : next.delete(id);
        return next;
      });
      setError("La mise à jour a échoué.");
    }
  }

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-[#524D66]">Chargement…</p>
    );
  }

  // Aucune langue déclarée : le parcours n'a pas de sens
  if (!languages.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <Compass className="mx-auto mb-3 text-[#C7BFF5]" size={32} />
        <p className="mb-4 text-sm text-[#524D66]">
          Déclare d'abord une langue pour voir ton parcours d'apprentissage.
        </p>
        <Link
          to="/dashboard/profile"
          className="inline-block rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5a4bd4]"
        >
          Déclarer une langue
        </Link>
      </div>
    );
  }

  // niveaux réellement présents dans le référentiel, dans l'ordre du CECRL
  const presentLevels = LEVELS.filter((lvl) =>
    objectives.some((o) => o.level === lvl)
  );

  const totalAchieved = objectives.filter((o) =>
    achieved.has(o.id_learning_objective)
  ).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* En-tête + sélecteur de langue */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1523]">Mon parcours</h1>
          <p className="text-sm text-[#524D66]">
            {totalAchieved} objectif{totalAchieved > 1 ? "s" : ""} sur{" "}
            {objectives.length}
          </p>
        </div>

      <select
            value={selectedLanguage ?? ""}
            onChange={(e) => setSelectedLanguage(Number(e.target.value))}
            className="rounded-xl border border-solid border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1523] focus:border-[#6C5CE7] focus:outline-none"
         >
            {languages.map((ul) => (
                <option key={ul.id} value={ul.language.id_language}>
                    {ul.language.name}
                </option>
            ))}
      </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Référentiel vide pour cette langue */}
      {objectives.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-[#524D66]">
            Le parcours de cette langue n'est pas encore disponible. Il est en
            cours de préparation.
          </p>
        </div>
      ) : (
        presentLevels.map((level) => {
          const levelObjectives = objectives.filter((o) => o.level === level);
          const done = levelObjectives.filter((o) =>
            achieved.has(o.id_learning_objective)
          ).length;
          const percent = Math.round((done / levelObjectives.length) * 100);

          // catégories présentes à ce niveau, dans l'ordre défini
          const categories = Object.keys(CATEGORY_LABELS).filter((cat) =>
            levelObjectives.some((o) => o.category === cat)
          );

          return (
            <section key={level} className="rounded-2xl bg-white p-5 shadow-sm">
              {/* En-tête du niveau + barre de progression */}
              <div className="mb-4">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-bold text-[#1A1523]">{level}</h2>
                  <span className="text-sm text-[#524D66]">
                    {done}/{levelObjectives.length}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDE9F7]">
                  <div
                    className="h-full rounded-full bg-[#6C5CE7] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Objectifs groupés par catégorie */}
              <div className="space-y-5">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#524D66]">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <ul className="space-y-1">
                      {levelObjectives
                        .filter((o) => o.category === category)
                        .map((o) => {
                          const isDone = achieved.has(o.id_learning_objective);
                          return (
                            <li key={o.id_learning_objective}>
                              <button
                                onClick={() => toggle(o.id_learning_objective)}
                                className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[#FAFAFE]"
                              >
                                <span
                                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                                    isDone
                                      ? "border-[#6C5CE7] bg-[#6C5CE7]"
                                      : "border-[#E2DDF4] bg-white"
                                  }`}
                                >
                                  {isDone && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                  )}
                                </span>

                                <span className="min-w-0">
                                  <span
                                    className={`block text-sm ${
                                      isDone
                                        ? "text-[#C7BFF5] line-through"
                                        : "text-[#1A1523]"
                                    }`}
                                  >
                                    {o.title}
                                  </span>
                                  {o.description && (
                                    <span className="mt-0.5 block text-xs text-[#524D66]">
                                      {o.description}
                                    </span>
                                  )}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

export default Journey;