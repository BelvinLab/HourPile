const TONES = {
  violet:   { bg: "bg-[#EDE9F7]", text: "text-[#6C5CE7]" },
  emeraude: { bg: "bg-[#D1FAE5]", text: "text-[#059669]" },
  ambre:    { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
};
function MetricCard({ valeur, icon, label, sublabel, tone = "violet" }) {
  const t = TONES[tone];
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[#524D66]">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.bg} ${t.text}`}>
          {icon}
        </span>
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-[#1A1523]">{valeur}</p>
      {sublabel && <p className="mt-1 text-xs text-[#524D66]">{sublabel}</p>}
    </div>
  );
}

export default MetricCard;