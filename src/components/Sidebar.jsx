import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, PlusCircle, LogOut, Layers, PieChart } from "lucide-react"; // Imported PieChart icon

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // Added Analytics path between Dashboard and Add Interview
  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Analytics", path: "/analytics", icon: PieChart }, 
    { name: "Manage Resumes", path: "/resumes", icon: Layers }, // New separate canvas link view mapping option
    { name: "Add Interview", path: "/add", icon: PlusCircle },
];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 text-slate-400 select-none">
      <div className="p-6">
        {/* Brand System */}
        <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight mb-8">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <Layers className="w-5 h-5" />
          </div>
          TrackHire
        </div>

        {/* Navigation Map */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" 
                    : "hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pinned Footer Interface */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-900">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors duration-150 group"
        >
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;