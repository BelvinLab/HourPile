import { useState, useEffect } from "react";
import { Clock, ListChecks, Flame } from "lucide-react";
import MetricCard from "../components/dashboard/MetricCard";
import VocabularyTicker from "../components/dashboard/VocabularyTicker";
import DailyTimeChart from "../components/dashboard/DailyTimeChart";
import ActivityBreakdown from "../components/dashboard/ActivityBreakdown";
import ConsistencyGrid from "../components/dashboard/ConsistencyGrid";
import { getMySession } from "../api/sessionService";
import { getMyVocabulary } from "../api/vocabularyService";

import {
  totalMinutes,
  formatDuration,
  groupByDay,
  groupByActivity,
  buildConsistencyData,
  calculateStreak,
  sessionsThisWeek,
} from "../utils/stats";

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Promise.all : les deux appels partent en parallèle,
    // on attend que les DEUX soient terminés.
    Promise.all([getMySession(), getMyVocabulary()])
      .then(([sessionsData, wordsData]) => {
        setSessions(sessionsData);
        setWords(wordsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-[#524D66]">Chargement…</p>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-sm text-red-500">{error}</p>
    );
  }

  // --- Calculs dérivés ---
  const total = totalMinutes(sessions);
  const weekSessions = sessionsThisWeek(sessions);
  const weekMinutes = totalMinutes(weekSessions);
  const streak = calculateStreak(sessions);

  // 50 mots les plus récents pour le ticker
  const recentWords = [...words]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50)
    .map((w) => ({ word: w.word, translation: w.translation }));

  return (
    <div className="space-y-4">
      <VocabularyTicker words={recentWords} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<ListChecks size={16} />}
          label="Sessions"
          valeur={sessions.length}
          sublabel={`${weekSessions.length} cette semaine`}
          tone="violet"
        />
        <MetricCard
          icon={<Clock size={16} />}
          label="Temps total"
          valeur={formatDuration(total)}
          sublabel={`+${formatDuration(weekMinutes)} cette semaine`}
          tone="emeraude"
        />
        <MetricCard
          icon={<Flame size={16} />}
          label="Série"
          valeur={streak > 0 ? `${streak} jour${streak > 1 ? "s" : ""}` : "—"}
          sublabel={streak > 0 ? "continue comme ça" : "commence aujourd'hui"}
          tone="ambre"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyTimeChart data={groupByDay(sessions)} />
        <ActivityBreakdown data={groupByActivity(sessions)} />
      </div>

      <ConsistencyGrid data={buildConsistencyData(sessions)} />
    </div>
  );
}

export default Dashboard;