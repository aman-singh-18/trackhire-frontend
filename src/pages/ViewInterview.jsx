import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Building2, Calendar, FileText, Briefcase, Edit2, Clock, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";

// Import the Markdown Engine Dependency
import ReactMarkdown from "react-markdown";

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

  // --- STAGE TRACKER WIDGET LOGIC CONFIGURATION ---
  const stages = ["Applied", "OA", "Interview"];
  const currentStageIndex = stages.indexOf(interview.status);
  const isOffer = interview.status === "Offer";
  const isRejected = interview.status === "Rejected";

  return (
    <div className="p-6 max-w-4xl mx-auto selection:bg-indigo-500 selection:text-white">
      {/* Navigation Return Hook */}
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Dashboard
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative space-y-8">
        
        {/* Header Profile Section Layout */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl hidden sm:block">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{interview.company}</h2>
              <p className="text-slate-400 mt-1 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" /> {interview.role}
              </p>
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

        {/* --- DYNAMIC KANBAN PIPELINE STEP TRACKER WIDGET --- */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2 relative">
            
            {stages.map((stage, idx) => {
              const isCompleted = currentStageIndex >= idx || isOffer || isRejected;
              const isCurrent = interview.status === stage;

              return (
                <div key={stage} className="flex-1 w-full flex items-center relative group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border
                      ${isCurrent ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 scale-105" : ""}
                      ${isCompleted && !isCurrent ? "bg-slate-800 text-indigo-400 border-slate-700" : ""}
                      ${!isCompleted ? "bg-slate-950 text-slate-600 border-slate-800" : ""}
                    `}>
                      {idx + 1}
                    </div>
                    <span className={`text-xs font-semibold tracking-wide uppercase
                      ${isCurrent ? "text-indigo-400 font-bold" : ""}
                      ${isCompleted && !isCurrent ? "text-slate-300" : ""}
                      ${!isCompleted ? "text-slate-600" : ""}
                    `}>
                      {stage === "OA" ? "Online Assessment" : stage}
                    </span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="hidden md:block flex-1 h-[2px] mx-4 bg-slate-800 overflow-hidden">
                      <div className={`h-full bg-indigo-500 transition-all duration-500 ${currentStageIndex > idx || isOffer || isRejected ? "w-full" : "w-0"}`} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Final Outcome Terminal Nodes */}
            <div className="flex items-center gap-3 border-t md:border-t-0 border-slate-800/60 pt-4 md:pt-0 w-full md:w-auto justify-center">
              {isOffer && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-bounce">
                  <CheckCircle className="w-4 h-4" /> Offer Achieved! 🎉
                </div>
              )}
              {isRejected && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Process Concluded
                </div>
              )}
              {!isOffer && !isRejected && (
                <div className="text-[11px] text-slate-500 font-medium tracking-wide italic">
                  Process ongoing...
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Informational Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Logged</p>
              <p className="text-sm text-slate-200 font-medium mt-0.5">
                {new Date(interview.appliedDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
          </div>
          
          {interview.taskDate && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Next Deadline/Task</p>
                <p className="text-sm text-amber-300 font-medium mt-0.5">
                  {new Date(interview.taskDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          )}

          {interview.resumePath ? (
            <a 
              href={`${import.meta.env.VITE_API_URL}/${interview.resumePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between gap-3 group hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Attached Document</p>
                  <p className="text-sm text-slate-200 font-medium mt-0.5 group-hover:text-white transition-colors">Attached Resume</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </a>
          ) : (
            <div className="bg-slate-950/20 border border-slate-800/40 rounded-xl p-4 flex items-center gap-3 select-none">
              <FileText className="w-5 h-5 text-slate-700" />
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Attached Document</p>
                <p className="text-xs text-slate-600 mt-0.5 italic">No asset uploaded</p>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Two-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" /> Interview Preparation Workspace
            </h4>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 min-h-64 text-slate-300 text-sm leading-relaxed">
              {interview.notes?.trim() ? (
                <div className="prose prose-invert max-w-none text-slate-300 MarkdownWorkspace">
                  <ReactMarkdown>{interview.notes}</ReactMarkdown>
                </div>
              ) : (
                <span className="text-slate-600 italic">No preparation notes added to this workspace yet.</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> Activity History Log
            </h4>
            <div className="bg-slate-950/30 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              {interview.history && interview.history.length > 0 ? (
                <div className="relative border-l border-slate-800 ml-2 space-y-6">
                  {interview.history.map((log, index) => (
                    <div key={log._id || index} className="relative pl-6 group">
                      <div className={`absolute -left-[6px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-950 transition-colors
                        ${log.status === 'Offer' ? 'bg-emerald-500' : ''}
                        ${log.status === 'Rejected' ? 'bg-rose-500' : ''}
                        ${log.status === 'Interview' ? 'bg-purple-500' : ''}
                        ${log.status === 'OA' ? 'bg-amber-500' : ''}
                        ${log.status === 'Applied' ? 'bg-blue-500' : ''}
                      `} />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white tracking-tight">{log.status}</span>
                          <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                            {new Date(log.changedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-normal">
                          {log.notesSnapshot || "Milestone state registered sync."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600 italic text-center py-4">No milestone transitions registered.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewInterview;