import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getMyVocabulary } from "../api/vocabularyService";
import { getLanguages } from "../api/sessionService";

// Traductions des catégories grammaticales
const CATEGORY_LABELS = {
  noun: "Nom",
  verb: "Verbe",
  adjective: "Adjectif",
  adverb: "Adverbe",
  expression: "Expression",
  phrasal_verb: "Verbe à particule",
  preposition: "Préposition",
  other: "Autre",
};

function Vocabulary() {
  const [vocabularies, setVocabularies] = useState([]);
  const [languages, setLanguages] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLanguages(), getMyVocabulary()])
      .then(([languagesData, vocabulariesData]) => {
        setVocabularies(vocabulariesData);
        const map = {};
        for (const lang of languagesData) map[lang.id_language] = lang.name;
        setLanguages(map);
      })
      .catch(() => setError("Impossible de charger le vocabulaire."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-[#524D66]">Chargement…</p>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  if (!vocabularies.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <BookOpen className="mx-auto mb-3 text-[#C7BFF5]" size={32} />
        <p className="text-sm text-[#524D66]">
          Ton carnet est vide. Ajoute ton premier mot pour commencer à
          construire ton vocabulaire.
        </p>
      </div>
    );
  }

  // du plus récent au plus ancien
  const sorted = [...vocabularies].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#1A1523]">Mon vocabulaire</h1>
        <p className="text-sm text-[#524D66]">
          {vocabularies.length} mot{vocabularies.length > 1 ? "s" : ""}{" "}
          enregistré{vocabularies.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* grille : 1 colonne mobile, 2 tablette, 3 desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((vocabulary) => (
          <div
            key={vocabulary.id_vocabulary ?? vocabulary.word}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-sm"
          >
            {/* mot -> traduction */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#1A1523]">
                {vocabulary.word}
              </span>
              <span className="text-[#C7BFF5]">→</span>
              <span className="text-[#524D66]">{vocabulary.translation}</span>
            </div>

            {/* définition */}
            {vocabulary.definition && (
              <p className="mt-2 text-sm text-[#524D66]">
                {vocabulary.definition}
              </p>
            )}

            {/* exemple, en italique et détaché */}
            {vocabulary.example && (
              <p className="mt-2 border-l-2 border-[#EDE9F7] pl-3 text-sm italic text-[#524D66]">
                {vocabulary.example}
              </p>
            )}

            {/* pied : catégorie + langue */}
            <div className="mt-auto flex items-center gap-2 pt-3">
              {vocabulary.category && (
                <span className="rounded-full bg-[#EDE9F7] px-2.5 py-1 text-xs font-medium text-[#6C5CE7]">
                  {CATEGORY_LABELS[vocabulary.category] ?? vocabulary.category}
                </span>
              )}
              <span className="text-xs text-[#524D66]">
                {languages[vocabulary.id_language] ?? ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vocabulary;