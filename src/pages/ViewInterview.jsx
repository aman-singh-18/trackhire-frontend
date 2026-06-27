import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Building2, Calendar, FileText, Briefcase, Edit2 } from "lucide-react";

const ViewInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/interviews/${id}`);
        if (res.data.success) {
          setInterview(res.data.interview);
        }
      } catch (err) {
        toast.error("Failed to read tracking information");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto selection:bg-indigo-500 selection:text-white">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Dashboard
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-6 mb-6 gap-4">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl hidden sm:block">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{interview.company}</h2>
              <p className="text-slate-400 mt-1 flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-500" /> {interview.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border
              ${interview.status === 'Offer' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
              ${interview.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
              ${interview.status === 'Interview' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
              ${interview.status === 'OA' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
              ${interview.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
            `}>
              {interview.status}
            </span>
            <Link 
              to={`/edit/${interview._id}`}
              className="flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl transition-all"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Logged</p>
              <p className="text-sm text-slate-200 font-medium mt-0.5">{new Date(interview.appliedDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-500" /> Track Log Notes
          </h4>
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap min-h-32">
            {interview.notes.trim() ? interview.notes : <span className="text-slate-600 italic">No notes added to this interview workspace card yet.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInterview;