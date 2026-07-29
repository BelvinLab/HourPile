import { NavLink } from "react-router-dom";
import { LayoutDashboard, Clock, BookOpen } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Accueil", icon: LayoutDashboard, end: true },
  { to: "/dashboard/sessions", label: "Sessions", icon: Clock },
  { to: "/dashboard/vocabulary", label: "Vocabulaire", icon: BookOpen },
];

function BottomNav() {
  return (
    // visible uniquement sous md, fixée en bas
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#EDE9F7] bg-white md:hidden">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${
              isActive ? "text-[#6C5CE7]" : "text-[#524D66]"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;