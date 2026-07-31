import { useState, useEffect } from "react";
import Button from "../form/Button";
import { getLanguages } from "../../api/SessionService";
import {
  declareLanguage,
  updateUserLanguage,
} from "../../api/userLanguageService";

// Doit correspondre EXACTEMENT à l'enum ProficiencyLevel du backend
const LEVELS = [
  { value: "A1", label: "A1 — Débutant" },
  { value: "A2", label: "A2 — Élémentaire" },
  { value: "B1", label: "B1 — Intermédiaire" },
  { value: "B2", label: "B2 — Intermédiaire supérieur" },
  { value: "C1", label: "C1 — Avancé" },
  { value: "C2", label: "C2 — Maîtrise" },
];

const selectClass =
  "w-full rounded-xl border border-solid border-gray-200 bg-white px-4 py-3 text-[#1A1523] focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 transition";

// `existing` : si fourni, on est en modification (la langue ne change plus)
function LanguageForm({ existing = null, onSuccess }) {
  const [languages, setLanguages] = useState([]);
  const [idLanguage, setIdLanguage] = useState(
    existing ? String(existing.language.id_language) : ""
  );
  const [currentLevel, setCurrentLevel] = useState(
    existing?.current_level ?? "A1"
  );
  const [targetLevel, setTargetLevel] = useState(existing?.target_level ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // inutile de charger le référentiel en modification
    if (existing) return;
    getLanguages()
      .then((data) => {
        setLanguages(data);
        if (data.length) setIdLanguage(String(data[0].id_language));
      })
      .catch(() => setError("Impossible de charger les langues."));
  }, [existing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (existing) {
        await updateUserLanguage(existing.id, {
          currentLevel,
          targetLevel,
        });
      } else {
        await declareLanguage({ idLanguage, currentLevel, targetLevel });
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Langue
        </label>
        {existing ? (
          <p className="rounded-xl bg-[#F5F3FB] px-4 py-3 font-medium text-[#1A1523]">
            {existing.language.name}
          </p>
        ) : (
          <select
            value={idLanguage}
            onChange={(e) => setIdLanguage(e.target.value)}
            className={selectClass}
          >
            {languages.map((lang) => (
              <option key={lang.id_language} value={lang.id_language}>
                {lang.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Niveau actuel
        </label>
        <select
          value={currentLevel}
          onChange={(e) => setCurrentLevel(e.target.value)}
          className={selectClass}
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Niveau visé{" "}
          <span className="font-normal text-[#524D66]">(facultatif)</span>
        </label>
        <select
          value={targetLevel}
          onChange={(e) => setTargetLevel(e.target.value)}
          className={selectClass}
        >
          <option value="">Aucun objectif</option>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Enregistrement…" : existing ? "Mettre à jour" : "Déclarer"}
      </Button>
    </form>
  );
}

export default LanguageForm;