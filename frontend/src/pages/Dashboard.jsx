import { Clock, ListChecks, Flame } from "lucide-react";
import MetricCard from "../components/dashboard/MetricCard";
import DailyTimeChart from "../components/dashboard/DailyTimeChart";
import ActivityBreakdown from "../components/dashboard/ActivityBreakdown";
import ConsistencyGrid from "../components/dashboard/ConsistencyGrid";
import VocabularyTicker from "../components/dashboard/VocabularyTicker";

// --- Données de démonstration (à remplacer par l'API) ---
const dailyData = [
  { jour: "Lun", minutes: 45 },
  { jour: "Mar", minutes: 0 },
  { jour: "Mer", minutes: 90 },
  { jour: "Jeu", minutes: 30 },
  { jour: "Ven", minutes: 60 },
  { jour: "Sam", minutes: 120 },
  { jour: "Dim", minutes: 25 },
];

const activityData = [
  { activite: "Lecture", minutes: 320 },
  { activite: "Écoute", minutes: 180 },
  { activite: "Écriture", minutes: 95 },
  { activite: "Conversation", minutes: 60 },
  { activite: "Révision", minutes: 40 },
];
// --- Données de démonstration ---
const recentWords = [
  { word: "apprendre", translation: "to learn" },
  { word: "la constance", translation: "consistency" },
  { word: "s'accumuler", translation: "to add up" },
  { word: "quotidien", translation: "daily" },
  { word: "la progression", translation: "progress" },
  { word: "l'habitude", translation: "habit" },
  { word: "atteindre", translation: "to reach" },
  { word: "le vocabulaire", translation: "vocabulary" },
];

// 84 jours = 12 semaines
const consistencyData = Array.from({ length: 84 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (83 - i));
  return {
    date: date.toISOString().slice(0, 10),
    minutes: Math.random() > 0.35 ? Math.floor(Math.random() * 120) : 0,
  };
});

function Dashboard() {
  return (
    <div className="space-y-4">
         <VocabularyTicker words={recentWords} />
      {/* Les trois métriques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
       
       <MetricCard icon={<ListChecks size={16} />} label="Sessions" valeur="12" sublabel="3 cette semaine" tone="violet" />
       <MetricCard icon={<Clock size={16} />} label="Temps total" valeur="47h 30m" sublabel="+5h cette semaine" tone="emeraude" />
       <MetricCard icon={<Flame size={16} />} label="Série" valeur="8 jours" sublabel="record : 14 jours" tone="ambre" />
      </div>

      {/* Les deux graphes côte à côte */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyTimeChart data={dailyData} />
        <ActivityBreakdown data={activityData} />
      </div>

      {/* La grille de régularité, pleine largeur */}
      <ConsistencyGrid data={consistencyData} />
    </div>
  );
}

export default Dashboard;