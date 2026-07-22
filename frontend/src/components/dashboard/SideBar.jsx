import { NavLink } from "react-router-dom";
import { LayoutDashboard, Clock, BookOpen } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/sessions", label: "Sessions", icon: Clock },
  { to: "/dashboard/vocabulary", label: "Vocabulaire", icon: BookOpen },
];

function SideBar() {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      {/* h-full : remplit toute la hauteur de la colonne */}
      <nav className="h-full overflow-y-auto rounded-2xl bg-white p-3 shadow-sm">
        <ul className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#6C5CE7] text-white"
                      : "text-[#524D66] hover:bg-[#EDE9F7]"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SideBar;