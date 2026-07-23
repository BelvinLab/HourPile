import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { logout } from "../../api/authServices";

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE9F7] font-bold text-[#6C5CE7] transition hover:bg-[#E2DDF4]"
      >
        {user?.[0]?.toUpperCase() ?? "?"}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button
            onClick={() => { setOpen(false); navigate("/dashboard/profile"); }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#1A1523] transition hover:bg-[#F5F3FB]"
          >
            <User size={16} /> Mon profil
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;