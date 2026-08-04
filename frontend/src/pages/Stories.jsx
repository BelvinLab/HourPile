import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Sparkles, BookText, Loader2 } from "lucide-react";
import { getMyLanguages } from "../api/userLanguageService";
import { getMyStories, generateStory } from "../api/storyServices";
import Modal from "../components/ui/Modal";

// Échappe les caractères spéciaux avant de construire une expression régulière
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Découpe le texte en fragments, en marquant ceux qui correspondent
 * à un mot appris. On tolère les suffixes courants (-s, -ed, -ing…)
 * pour attraper les formes fléchies : improve -> improved, improving.
 *
 * Limite assumée : ça ne rattrape pas les irréguliers (go -> went),
 * et les suffixes visés sont ceux de l'anglais.
 */
function highlightWords(text, words) {
  if (!words.length) return [{ text, isWord: false }];

  const pattern = words
    .map((w) => `${escapeRegex(w.trim())}(?:s|es|ed|ing|d|ly)?`)
    .sort((a, b) => b.length - a.length) // les plus longs d'abord
    .join("|");

  const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isWord: false });
    }
    parts.push({ text: match[0], isWord: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isWord: false });
  }

  return parts;
}

function StoryContent({ story }) {
  const words = story.words_used ? story.words_used.split(",") : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {story.theme && (
          <span className="rounded-full bg-[#EDE9F7] px-2.5 py-1 text-xs font-medium text-[#6C5CE7]">
            {story.theme}
          </span>
        )}
        <span className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-xs font-medium text-[#059669]">
          {story.level}
        </span>
      </div>

      {/* le texte, découpé en paragraphes sur les sauts de ligne */}
      <div className="space-y-3 text-[15px] leading-relaxed text-[#1A1523]">
        {story.content.split("\n").filter(Boolean).map((paragraph, i) => (
          <p key={i}>
            {highlightWords(paragraph, words).map((part, j) =>
              part.isWord ? (
                <mark
                  key={j}
                  className="rounded bg-[#EDE9F7] px-0.5 font-medium text-[#6C5CE7]"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={j}>{part.text}</span>
              )
            )}
          </p>
        ))}
      </div>

      {words.length > 0 && (
        <div className="border-t border-[#F5F3FB] pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#524D66]">
            Mots travaillés
          </p>
          <div className="flex flex-wrap gap-1.5">
            {words.map((w) => (
              <span
                key={w}
                className="rounded-lg bg-[#F5F3FB] px-2 py-1 text-xs text-[#1A1523]"
              >
                {w.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stories() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [stories, setStories] = useState([]);
  const [openStory, setOpenStory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadAll = useCallback(() => {
    Promise.all([getMyLanguages(), getMyStories()])
      .then(([languagesData, storiesData]) => {
        setLanguages(languagesData);
        setStories(storiesData);
        if (languagesData.length && selectedLanguage === null) {
          setSelectedLanguage(languagesData[0].language.id_language);
        }
      })
      .catch(() => setError("Impossible de charger tes histoires."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleGenerate() {
    if (!selectedLanguage) return;
    setError("");
    setGenerating(true);

    try {
      const story = await generateStory(selectedLanguage);
      setStories((prev) => [story, ...prev]);
      setOpenStory(story); // on ouvre directement la nouvelle histoire
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-[#524D66]">Chargement…</p>
    );
  }

  if (!languages.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <BookText className="mx-auto mb-3 text-[#C7BFF5]" size={32} />
        <p className="mb-4 text-sm text-[#524D66]">
          Déclare une langue et ajoute quelques mots pour générer tes premières
          histoires.
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

  const visibleStories = stories.filter(
    (s) => s.id_language === selectedLanguage
  );

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold text-[#1A1523]">Mes histoires</h1>
        <p className="text-sm text-[#524D66]">
          Des textes courts écrits à partir de ton vocabulaire.
        </p>
      </div>

      {/* Barre d'action */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
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

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5a4bd4] disabled:opacity-60"
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Génération en cours…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Générer une histoire
            </>
          )}
        </button>

        {generating && (
          <span className="text-xs text-[#524D66]">
            Cela peut prendre quelques secondes.
          </span>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Liste */}
      {visibleStories.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <BookText className="mx-auto mb-3 text-[#C7BFF5]" size={32} />
          <p className="text-sm text-[#524D66]">
            Aucune histoire pour cette langue. Ajoute au moins 8 mots à ton
            vocabulaire, puis lance une génération.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleStories.map((story) => (
            <button
              key={story.id_story}
              onClick={() => setOpenStory(story)}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2">
                {story.theme && (
                  <span className="rounded-full bg-[#EDE9F7] px-2 py-0.5 text-xs font-medium text-[#6C5CE7]">
                    {story.theme}
                  </span>
                )}
                <span className="text-xs text-[#524D66]">{story.level}</span>
              </div>

              <h2 className="font-bold text-[#1A1523]">{story.title}</h2>

              <p className="mt-2 line-clamp-3 text-sm text-[#524D66]">
                {story.content}
              </p>

              <p className="mt-3 text-xs text-[#C7BFF5]">
                {new Date(story.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Lecture */}
      <Modal
        open={openStory !== null}
        onClose={() => setOpenStory(null)}
        title={openStory?.title ?? ""}
      >
        {openStory && <StoryContent story={openStory} />}
      </Modal>
    </div>
  );
}

export default Stories;