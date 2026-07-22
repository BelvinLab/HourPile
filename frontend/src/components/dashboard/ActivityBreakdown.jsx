import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function formatMinutes(min) {
  if (!min) return "0";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h${m ? String(m).padStart(2, "0") : ""}` : `${m}min`;
}

// Une nuance par activité, du plus soutenu au plus clair
const COLORS = [
  "#6C5CE7",  // Lecture — violet
  "#10B981",  // Écoute — émeraude
  "#F59E0B",  // Écriture — ambre
  "#3B82F6",  // Conversation — bleu
  "#EC4899",  // Révision — rose
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { activite, minutes } = payload[0].payload;
  return (
    <div className="rounded-lg bg-[#1A1523] px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{activite}</p>
      <p className="text-[#C7BFF5]">{formatMinutes(minutes)}</p>
    </div>
  );
}

function ActivityBreakdown({ data = [] }) {
  const isEmpty = !data.length || data.every((d) => !d.minutes);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1A1523]">
        Répartition par activité
      </h3>
      <p className="mb-4 text-xs text-[#524D66]">Depuis le début</p>

      {isEmpty ? (
        <div className="flex h-55 items-center justify-center text-center text-sm text-[#524D66]">
          Tes types d'activité s'afficheront ici après ta première session.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          {/* layout="vertical" = barres HORIZONTALES.
              L'axe X porte les nombres, l'axe Y porte les labels. */}
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="activite"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{ fill: "#524D66", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F3FB" }} />
            <Bar dataKey="minutes" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ActivityBreakdown;