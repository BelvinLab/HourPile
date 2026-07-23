// --- Utilitaire : "2026-07-21" à partir d'une Date ---
function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

// --- Total des minutes ---
export function totalMinutes(sessions) {
  return sessions.reduce((sum, s) => sum + s.duration, 0);
}

// --- "47h 30m" ---
export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// --- Les 7 derniers jours, pour DailyTimeChart ---
const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function groupByDay(sessions) {
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = toISODate(date);

    // on additionne toutes les sessions de ce jour
    const minutes = sessions
      .filter((s) => s.session_date?.slice(0, 10) === iso)
      .reduce((sum, s) => sum + s.duration, 0);

    result.push({ jour: DAY_LABELS[date.getDay()], minutes });
  }

  return result;
}

// --- Répartition par activité, pour ActivityBreakdown ---
const ACTIVITY_LABELS = {
  reading: "Lecture",
  listening: "Écoute",
  writing: "Écriture",
  speaking: "Conversation",
  review: "Révision",
};

export function groupByActivity(sessions) {
  const totals = {};

  for (const s of sessions) {
    totals[s.activity] = (totals[s.activity] || 0) + s.duration;
  }

  return Object.entries(totals)
    .map(([key, minutes]) => ({
      activite: ACTIVITY_LABELS[key] ?? key,
      minutes,
    }))
    .sort((a, b) => b.minutes - a.minutes);   // du plus grand au plus petit
}

// --- Les 84 derniers jours, pour ConsistencyGrid ---
export function buildConsistencyData(sessions, days = 84) {
  const byDate = {};
  for (const s of sessions) {
    const iso = s.session_date?.slice(0, 10);
    if (iso) byDate[iso] = (byDate[iso] || 0) + s.duration;
  }

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = toISODate(date);
    result.push({ date: iso, minutes: byDate[iso] || 0 });
  }

  return result;
}

// --- Série de jours consécutifs ---
export function calculateStreak(sessions) {
  // l'ensemble des jours où au moins une session existe
  const activeDays = new Set(
    sessions.map((s) => s.session_date?.slice(0, 10)).filter(Boolean)
  );

  if (!activeDays.size) return 0;

  const today = toISODate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // La série ne peut commencer qu'aujourd'hui ou hier.
  // Sinon elle est déjà cassée.
  let cursor = new Date();
  if (!activeDays.has(today)) {
    if (!activeDays.has(toISODate(yesterday))) return 0;
    cursor = yesterday;
  }

  // on remonte tant que le jour précédent est actif
  let streak = 0;
  while (activeDays.has(toISODate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

// --- Sessions de cette semaine (pour les sous-labels) ---
export function sessionsThisWeek(sessions) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const limit = toISODate(weekAgo);

  return sessions.filter((s) => s.session_date?.slice(0, 10) >= limit);
}