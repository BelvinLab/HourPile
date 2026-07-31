import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  ListChecks,
  Flame,
  BookOpen,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { getMe } from "../api/authServices";
import { getMySession } from "../api/sessionService";
import { getMyVocabulary } from "../api/vocabularyService";
import { getMyLanguages, deleteUserLanguage } from "../api/userLanguageService";
import Modal from "../components/ui/Modal";
import ProfileForm from "../components/dashboard/Profileform";
import LanguageForm from "../components/dashboard/Languageform";
import { totalMinutes, formatDuration, calculateStreak } from "../utils/stats";

function formatMonthYear(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

function StatTile({ icon, label, value, tone }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[#524D66]">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}
        >
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
  const [userLanguages, setUserLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  // la langue en cours de modification (null = déclaration d'une nouvelle)
  const [editingLanguage, setEditingLanguage] = useState(null);

  // useCallback : la fonction garde la même identité entre les rendus,
  // on peut donc l'appeler depuis les modales pour tout recharger
  const loadAll = useCallback(() => {
    Promise.all([getMe(), getMySession(), getMyVocabulary(), getMyLanguages()])
      .then(([userData, sessionsData, wordsData, languagesData]) => {
        setUser(userData);
        setSessions(sessionsData);
        setWords(wordsData);
        setUserLanguages(languagesData);
      })
      .catch(() => setError("Impossible de charger le profil."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleDeleteLanguage(id) {
    if (!confirm("Retirer cette langue ? Tes sessions seront conservées."))
      return;
    try {
      await deleteUserLanguage(id);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function openNewLanguage() {
    setEditingLanguage(null);
    setLanguageModalOpen(true);
  }

  function openEditLanguage(userLanguage) {
    setEditingLanguage(userLanguage);
    setLanguageModalOpen(true);
  }

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-[#524D66]">Chargement…</p>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  const total = totalMinutes(sessions);
  const streak = calculateStreak(sessions);
  const initial = user?.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* --- Identité --- */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EDE9F7] text-2xl font-bold text-[#6C5CE7]">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-[#1A1523]">
              {user.first_name} {user.last_name}
            </h1>
            <p className="truncate text-sm text-[#524D66]">{user.email}</p>
            <p className="mt-0.5 text-xs text-[#524D66]">
              Membre depuis {formatMonthYear(user.created_at)}
            </p>
          </div>

          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E2DDF4] px-3 py-2 text-sm font-medium text-[#1A1523] transition hover:bg-[#EDE9F7]"
          >
            <Pencil size={14} /> Modifier
          </button>
        </div>

        <div className="mt-4 border-t border-[#F5F3FB] pt-4">
          {user.bio ? (
            <p className="text-sm text-[#524D66]">{user.bio}</p>
          ) : (
            <p className="text-sm italic text-[#C7BFF5]">
              Aucune bio pour l'instant.
            </p>
          )}
        </div>
      </div>

      {/* --- Langues --- */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1A1523]">Mes langues</h2>
          <button
            onClick={openNewLanguage}
            className="flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5a4bd4]"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>

        {userLanguages.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-[#524D66]">
              Déclare les langues que tu apprends, avec ton niveau actuel et
              celui que tu vises.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userLanguages.map((ul) => (
              <div
                key={ul.id}
                className="flex items-center gap-2 rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1A1523]">
                    {ul.language.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-[#EDE9F7] px-2.5 py-0.5 text-xs font-medium text-[#6C5CE7]">
                      {ul.current_level}
                    </span>
                    {ul.target_level && (
                      <>
                        <span className="text-[#C7BFF5]">→</span>
                        <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-xs font-medium text-[#059669]">
                          {ul.target_level}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openEditLanguage(ul)}
                  className="rounded-lg p-2 text-[#524D66] transition hover:bg-[#EDE9F7]"
                  aria-label="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteLanguage(ul.id)}
                  className="rounded-lg p-2 text-[#524D66] transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Retirer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Parcours --- */}
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
      </div>

      {/* --- Modales --- */}
      <Modal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Modifier mon profil"
      >
        <ProfileForm
          user={user}
          onSuccess={() => {
            setProfileModalOpen(false);
            loadAll();
          }}
        />
      </Modal>

      <Modal
        open={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        title={editingLanguage ? "Modifier la langue" : "Déclarer une langue"}
      >
        <LanguageForm
          existing={editingLanguage}
          onSuccess={() => {
            setLanguageModalOpen(false);
            loadAll();
          }}
        />
      </Modal>
    </div>
  );
}

export default Profile;