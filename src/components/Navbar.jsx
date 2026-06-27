import { useAuth } from "../context/AuthContext";
import { User, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-end px-8 text-slate-300">
      <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/80 px-3 py-1.5 rounded-xl">
        <div className="w-8 h-8 bg-slate-800 border border-slate-700 flex items-center justify-center rounded-lg text-indigo-400 font-semibold text-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs text-white font-medium leading-none">{user?.name || "Developer"}</p>
          <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-0.5 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-indigo-500" /> Verified Session
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;