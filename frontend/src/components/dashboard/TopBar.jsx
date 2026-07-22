import { Link } from "react-router-dom";
import { Plus, BookPlus } from "lucide-react";

function TopBar({ user,onNewSession }) {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-6 bg-white px-6 py-4 shadow-sm">
      <div className="text-xl font-extrabold text-[#1A1523]">HourPile</div>

      <p className="hidden flex-1 text-sm text-[#524D66] md:block">
        Bienvenue <span className="font-semibold text-[#1A1523]">{user}</span>,
        content de te revoir
      </p>

      <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5a4bd4]"
           >
    <Plus size={16} /> Session
  </button>
        <Link
          to="/dashboard/vocabulary/new"
          className="flex items-center gap-1.5 rounded-lg border border-[#E2DDF4] px-3 py-2 text-sm font-semibold text-[#1A1523] transition hover:bg-[#EDE9F7]"
        >
          <BookPlus size={16} /> Mot
        </Link>
      </div>

      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE9F7] font-bold text-[#6C5CE7]">
        {user?.[0]?.toUpperCase() ?? "?"}
      </button>
    </header>
  );
}

export default TopBar;