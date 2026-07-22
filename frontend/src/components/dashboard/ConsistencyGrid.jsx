// Attend : [{ date: "2026-07-15", minutes: 45 }, ...] sur les 12 dernières semaines,
// ordonné du plus ancien au plus récent, et complété (les jours sans session
// doivent être présents avec minutes: 0).

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

// 5 niveaux d'intensité selon le temps travaillé
function levelFor(minutes) {
  if (!minutes) return 0;
  if (minutes < 20) return 1;
  if (minutes < 45) return 2;
  if (minutes < 90) return 3;
  return 4;
}

const LEVEL_COLORS = [
  "bg-[#EDE9F7]",   // 0 — rien
  "bg-[#C7BFF5]",   // 1
  "bg-[#9E8FF1]",   // 2
  "bg-[#7B69EA]",   // 3
  "bg-[#6C5CE7]",   // 4 — journée forte
];

function ConsistencyGrid({ data = [] }) {
  const isEmpty = !data.length || data.every((d) => !d.minutes);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1A1523]">
        Régularité
      </h3>
      <p className="mb-4 text-xs text-[#524D66]">12 dernières semaines</p>

      {isEmpty ? (
        <div className="flex h-35 items-center justify-center text-center text-sm text-[#524D66]">
          Chaque jour travaillé remplira une case. Commence ta chaîne aujourd'hui.
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* Colonne des initiales de jours */}
            <div className="grid grid-rows-7 gap-1 pr-1">
              {DAYS.map((d, i) => (
                <span
                  key={i}
                  className="flex h-3.5 items-center text-[10px] leading-none text-[#524D66]"
                >
                  {i % 2 === 1 ? d : ""}
                </span>
              ))}
            </div>

            {/* La grille : 7 lignes, remplissage colonne par colonne (= semaine par semaine) */}
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {data.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date} — ${day.minutes} min`}
                  className={`h-3.5 w-3.5 rounded-[3px] ${LEVEL_COLORS[levelFor(day.minutes)]}`}
                />
              ))}
            </div>
          </div>

          {/* Légende */}
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-[#524D66]">
            <span>Moins</span>
            {LEVEL_COLORS.map((c, i) => (
              <span key={i} className={`h-3 w-3 rounded-[3px] ${c}`} />
            ))}
            <span>Plus</span>
          </div>
        </>
      )}
    </div>
  );
}

export default ConsistencyGrid;