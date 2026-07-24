import { useState, useEffect } from "react";
import Input from "../form/Input";
import Button from "../form/Button";
import { getLanguages } from "../../api/sessionService";
import { create_vocabulary } from "../../api/vocabularyService";

// Les valeurs doivent correspondre EXACTEMENT à ton enum backend
const CATEGORIES = [
  { value: "noun", label: "Nom" },
  { value: "verb", label: "Verbe" },
  { value: "adjective", label: "Adjectif" },
  { value: "adverb", label: "Adverbe" },
  { value: "expression", label: "Expression" },
  { value: "phrasal_verb", label: "Verbe à particule" },
  { value: "preposition", label: "Préposition" },
  { value: "other", label: "Autre" },
];

function VocabularyForm({ onSuccess }) {
  const [languages, setLanguages] = useState([]);
  const [idLanguage, setIdLanguage] = useState("");
  const [word, setWord] = useState("reading");
  const [translation, setTranslation] = useState("");
  const [definition, setDefinition] = useState("");
  const [example,setExample] = useState(" ")
  const [category,setCategory] = useState(" ")

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charge les langues au montage du composant
  useEffect(() => {
    getLanguages()
      .then((data) => {
        setLanguages(data);
        if (data.length) setIdLanguage(String(data[0].id_language));
      })
      .catch(() => setError("Impossible de charger les langues."));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");


    setLoading(true);
    try {
      await create_vocabulary({idLanguage,word,translation,definition,example,category})
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const selectClass =
    "w-full rounded-xl border border-solid border-gray-200 bg-white px-4 py-3 text-[#1A1523] focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Langue <span className="text-red-500">*</span>
        </label>
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
      </div>

     <Input
        label="Mot"
        id="word"
        type="text"
        required
        placeholder="Progresser "
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <Input
        label="Traduction du mot"
        id="translation"
        type="text"
        required
        placeholder="to progress"
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
      />

      <Input
        label="Définition"
        id="definition"
        placeholder="l'action  de ...."
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
      />
      <Input
        label="Exemple"
        id="exemple"
        placeholder="to progress ...."
        value={example}
        onChange={(e) => setExample(e.target.value)}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Catégorie 
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
        >
          {CATEGORIES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer la session"}
      </Button>
    </form>
  );
}

export default VocabularyForm;