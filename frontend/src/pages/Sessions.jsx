import { useState, useEffect } from "react";
import {useOutletContext} from "react-router-dom";
import { Clock } from "lucide-react";
import { getMySession } from "../api/sessionService";
import { getLanguages } from "../api/sessionService";

// --- Correspondances d'affichage ---
const ACTIVITY_LABELS = {
  reading: "Lecture",
  listening: "Écoute",
  writing: "Écriture",
  speaking: "Conversation",
  review: "Révision",
};

// une teinte par activité, réutilise la logique du dashboard
const ACTIVITY_TONES = {
  reading: "bg-[#EDE9F7] text-[#6C5CE7]",
  listening: "bg-[#D1FAE5] text-[#059669]",
  writing: "bg-[#FEF3C7] text-[#D97706]",
  speaking: "bg-[#DBEAFE] text-[#2563EB]",
  review: "bg-[#FCE7F3] text-[#DB2777]",
};

// "2026-07-23T06:36:19.383Z" -> "23 juil. 2026"
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// 90 -> "1h30" | 45 -> "45 min"
function formatDuration(min) {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { refresh_key } = useOutletContext();

  useEffect(() => {
    Promise.all([getMySession(), getLanguages()])
      .then(([sessionsData, languagesData]) => {
        setSessions(sessionsData);
        // on transforme la liste de langues en dictionnaire id -> nom
        // pour retrouver le nom en O(1) au lieu de chercher à chaque ligne
        const map = {};
        for (const lang of languagesData) map[lang.id_language] = lang.name;
        setLanguages(map);
      })
      .catch(() => setError("Impossible de charger les sessions."))
      .finally(() => setLoading(false));
  }, [refresh_key]);

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-[#524D66]">Chargement…</p>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  if (!sessions.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <Clock className="mx-auto mb-3 text-[#C7BFF5]" size={32} />
        <p className="text-sm text-[#524D66]">
          Aucune session pour l'instant. Enregistre ta première session pour
          la voir apparaître ici.
        </p>
      </div>
    );
  }

  // tri du plus récent au plus ancien
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.session_date) - new Date(a.session_date)
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#1A1523]">Mes sessions</h1>
        <p className="text-sm text-[#524D66]">
          {sessions.length} session{sessions.length > 1 ? "s" : ""} enregistrée
          {sessions.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* --- TABLEAU (desktop) --- */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#EDE9F7] text-xs uppercase tracking-wide text-[#524D66]">
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Langue</th>
              <th className="px-5 py-3 font-semibold">Activité</th>
              <th className="px-5 py-3 font-semibold">Durée</th>
              <th className="px-5 py-3 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((session) => (
              <tr
                key={session.id_session}
                className="border-b border-[#F5F3FB] last:border-0 hover:bg-[#FAFAFE]"
              >
                <td className="px-5 py-3 text-[#1A1523]">
                  {formatDate(session.session_date)}
                </td>
                <td className="px-5 py-3 text-[#524D66]">
                  {languages[session.id_language] ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      ACTIVITY_TONES[session.activity] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ACTIVITY_LABELS[session.activity] ?? session.activity}
                  </span>
                </td>
                <td className="px-5 py-3 font-medium text-[#1A1523]">
                  {formatDuration(session.duration)}
                </td>
                <td className="px-5 py-3 text-[#524D66]">
                  {session.note || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CARTES (mobile) --- */}
      <div className="space-y-3 md:hidden">
        {sorted.map((session) => (
          <div
            key={session.id_session}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1A1523]">
                {formatDate(session.session_date)}
              </span>
              <span className="text-sm font-medium text-[#1A1523]">
                {formatDuration(session.duration)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                  ACTIVITY_TONES[session.activity] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {ACTIVITY_LABELS[session.activity] ?? session.activity}
              </span>
              <span className="text-xs text-[#524D66]">
                {languages[session.id_language] ?? "—"}
              </span>
            </div>

            {session.note && (
              <p className="mt-2 text-sm text-[#524D66]">{session.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sessions;