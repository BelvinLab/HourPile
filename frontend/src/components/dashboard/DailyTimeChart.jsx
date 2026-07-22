import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 90 -> "1h30"  |  45 -> "45min"
function formatMinutes(min) {
  if (!min) return "0";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h${m ? String(m).padStart(2, "0") : ""}` : `${m}min`;
}

// Tooltip personnalisé : le style par défaut de recharts jure avec la palette
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-[#1A1523] px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-[#C7BFF5]">{formatMinutes(payload[0].value)}</p>
    </div>
  );
}

function DailyTimeChart({ data = [] }) {
  const isEmpty = !data.length || data.every((d) => !d.minutes);

  // le meilleur jour de la semaine, mis en avant en couleur pleine
  const max = Math.max(...data.map((d) => d.minutes), 0);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1A1523]">Temps par jour</h3>
      <p className="mb-4 text-xs text-[#524D66]">7 derniers jours</p>

      {isEmpty ? (
        <div className="flex h-55 items-center justify-center text-center text-sm text-[#524D66]">
          Enregistre une session pour voir ton activité apparaître ici.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="#EDE9F7" />
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#524D66", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#524D66", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F3FB" }} />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={38}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.minutes === max ? "#10B981" : "#D0C7FA"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default DailyTimeChart;