import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Call the double-handshake login procedure from Context
    const result = await login(formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/"); // Send to protected home dashboard
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-600 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">TrackHire</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in to manage your interview lifecycle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="yourname@example.com"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? "Signing In..." : <>Sign In <LogIn className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          New to TrackHire?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;