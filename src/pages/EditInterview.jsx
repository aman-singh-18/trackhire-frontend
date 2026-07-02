import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { Building2, Briefcase, Calendar, FileText, ArrowLeft, RefreshCw, FileCheck } from "lucide-react";

const EditInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resumePool, setResumePool] = useState([]); // Stores repository pool list array
  
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    notes: "",
    taskDate: "",
    resumePath: "", // Selected resume path hook parameter
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Concurrent fetching pool options and existing details parameters
        const [interviewRes, resumePoolRes] = await Promise.all([
          API.get(`/interviews/${id}`),
          API.get("/auth/resumes")
        ]);

        if (resumePoolRes.data.success) {
          setResumePool(resumePoolRes.data.resumes);
        }

        if (interviewRes.data.success) {
          const item = interviewRes.data.interview;
          setFormData({
            company: item.company,
            role: item.role,
            status: item.status,
            appliedDate: new Date(item.appliedDate).toISOString().split("T")[0],
            notes: item.notes || "",
            taskDate: item.taskDate ? new Date(item.taskDate).toISOString().split("T")[0] : "",
            resumePath: item.resumePath || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load application details");
        navigate("/");
      } {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const payload = { ...formData };
      if (!payload.taskDate) payload.taskDate = null;

      // Sent as standard application/json payload parameters mapping smoothly!
      const res = await API.put(`/interviews/${id}`, payload);
      if (res.data.success) {
        toast.success("Application card updated!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to modify entry data structure");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto selection:bg-indigo-500 selection:text-white">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Cancel and Return
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Modify Tracking Data</h2>
          <p className="text-sm text-slate-400 mt-1">Keep track of your progression rounds or update selection status blocks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Job Title / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Application Status</label>
              <select
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Applied">Applied</option>
                <option value="OA">OA (Online Assessment)</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Date Applied</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="date"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all scheme-dark"
                  value={formData.appliedDate}
                  onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Modify Task Scheduler input group */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 my-2">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Modify Milestone Reminder (Optional)
              </label>
            </div>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all scheme-dark"
                value={formData.taskDate}
                onChange={(e) => setFormData({ ...formData, taskDate: e.target.value })}
              />
            </div>
          </div>

          {/* Update Resume Selection Droplist */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Update Linked Resume Asset
              </label>
            </div>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all"
              value={formData.resumePath}
              onChange={(e) => setFormData({ ...formData, resumePath: e.target.value })}
            >
              <option value="">-- Select No Resume Linked --</option>
              {resumePool.map((res) => (
                <option key={res._id} value={res.filePath}>
                  {res.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Additional Notes</label>
            <div className="relative">
              <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
              <textarea
                rows="4"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ml-auto"
          >
            <RefreshCw className={`w-4 h-4 ${updating ? "animate-spin" : ""}`} /> {updating ? "Updating..." : "Save Modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;