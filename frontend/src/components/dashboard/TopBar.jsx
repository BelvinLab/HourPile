
import { Plus, BookPlus } from "lucide-react";
import {Link} from "react-router-dom"
import UserMenu from "./UserMenu";


function TopBar({ user,onNewSession,onNewWord }) {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-6 bg-white px-6 py-4 shadow-sm">
      <Link to="/" className="text-xl font-extrabold text-[#1A1523]">
  HourPile
</Link>
      

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
       <button
        
        onClick={onNewWord}
        className="flex items-center gap-1.5 rounded-lg border border-[#E2DDF4] px-3 py-2 text-sm font-semibold text-[#1A1523] transition hover:bg-[#EDE9F7]"
        >
        <BookPlus size={16} /> Mot
       </button>
      </div>

      <UserMenu user={user} />
    </header>
  );
}

export default TopBar;