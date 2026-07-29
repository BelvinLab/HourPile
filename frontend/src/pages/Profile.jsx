import { useState, useEffect } from "react";
import { Clock, ListChecks, Flame, BookOpen, Globe } from "lucide-react";
import { getMe } from "../api/authServices";
import { getMySession } from "../api/sessionService";
import { getMyVocabulary } from "../api/vocabularyService";
import {
  totalMinutes,
  formatDuration,
  calculateStreak,
} from "../utils/stats";

// "2026-07-23T..." -> "juillet 2026"
function formatMonthYear(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

// petite tuile de statistique
function StatTile({ icon, label, value, tone }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[#524D66]">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          {icon}
        </span>
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-[#1A1523]">{value}</p>
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMe(), getMySession(), getMyVocabulary()])
      .then(([userData, sessionsData, wordsData]) => {
        setUser(userData);
        setSessions(sessionsData);
        setWords(wordsData);
      })
      .catch(() => setError("Impossible de charger le profil."))
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

  // --- calculs de parcours ---
  const total = totalMinutes(sessions);
  const streak = calculateStreak(sessions);
  // nombre de langues distinctes travaillées
  const languageCount = new Set(sessions.map((s) => s.id_language)).size;

  const initial = user?.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* --- Carte identité --- */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE9F7] text-2xl font-bold text-[#6C5CE7]">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1523]">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm text-[#524D66]">{user.email}</p>
            <p className="mt-0.5 text-xs text-[#524D66]">
              Membre depuis {formatMonthYear(user.created_at)}
            </p>
          </div>
        </div>

        {user.bio && (
          <p className="mt-4 border-t border-[#F5F3FB] pt-4 text-sm text-[#524D66]">
            {user.bio}
          </p>
        )}
      </div>

      {/* --- Statistiques de parcours --- */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#1A1523]">
          Mon parcours
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile
            icon={<Clock size={16} />}
            label="Temps total"
            value={formatDuration(total)}
            tone="bg-[#D1FAE5] text-[#059669]"
          />
          <StatTile
            icon={<ListChecks size={16} />}
            label="Sessions"
            value={sessions.length}
            tone="bg-[#EDE9F7] text-[#6C5CE7]"
          />
          <StatTile
            icon={<BookOpen size={16} />}
            label="Mots appris"
            value={words.length}
            tone="bg-[#DBEAFE] text-[#2563EB]"
          />
          <StatTile
            icon={<Flame size={16} />}
            label="Série actuelle"
            value={streak > 0 ? `${streak} j` : "—"}
            tone="bg-[#FEF3C7] text-[#D97706]"
          />
        </div>

        {languageCount > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-[#524D66]">
            <Globe size={14} />
            {languageCount} langue{languageCount > 1 ? "s" : ""} en cours
            d'apprentissage
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;