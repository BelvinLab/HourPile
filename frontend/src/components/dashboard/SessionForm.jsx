import { useState, useEffect } from "react";
import Input from "../form/Input";
import Button from "../form/Button";
import { getLanguages,create_session } from "../../api/sessionService";

// Les valeurs doivent correspondre EXACTEMENT à ton enum backend
const ACTIVITIES = [
  { value: "reading", label: "Lecture" },
  { value: "listening", label: "Écoute" },
  { value: "writing", label: "Écriture" },
  { value: "speaking", label: "Conversation" },
  { value: "review", label: "Révision" },
];

function SessionForm({ onSuccess }) {
  const [languages, setLanguages] = useState([]);
  const [idLanguage, setIdLanguage] = useState("");
  const [activity, setActivity] = useState("reading");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [resource,setRessource] = useState(" ")

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

    if (!duration || Number(duration) <= 0) {
      setError("Indique une durée valide.");
      return;
    }

    setLoading(true);
    try {
      await create_session({idLanguage,activity,duration,note,resource})
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

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Activité <span className="text-red-500">*</span>
        </label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className={selectClass}
        >
          {ACTIVITIES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Durée (minutes)"
        id="duration"
        type="number"
        required
        placeholder="45"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <Input
        label="Note (facultatif)"
        id="note"
        placeholder="Chapitre 3 du livre..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Input
        label="Ressource (facultatif)"
        id="resource"
        placeholder="Article Wikipedia..."
        value={resource}
        onChange={(e) => setRessource(e.target.value)}
      />
      

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer la session"}
      </Button>
    </form>
  );
}

export default SessionForm;