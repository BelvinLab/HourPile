function VocabularyTicker({ words = [] }) {
  if (!words.length) {
    return (
      <div className="rounded-2xl bg-white px-5 py-4 text-center text-sm text-[#524D66] shadow-sm">
        Ajoute tes premiers mots pour les voir défiler ici.
      </div>
    );
  }

  // On duplique la liste : quand la première moitié a défilé,
  // la seconde prend le relais sans coupure visible.
  const loop = [...words, ...words];

  return (
    <div className="group overflow-hidden rounded-2xl bg-white py-3 shadow-sm">
      <div className="flex w-max gap-3 animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((w, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#F5F3FB] px-4 py-1.5 text-sm"
          >
            <span className="font-semibold text-[#1A1523]">{w.word}</span>
            <span className="text-[#C7BFF5]">→</span>
            <span className="text-[#524D66]">{w.translation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VocabularyTicker;