import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Building2, Briefcase, Calendar, FileText, ArrowLeft, Save, FileCheck } from "lucide-react";

const AddInterview = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [resumePool, setResumePool] = useState([]); // Stores the user's available resumes list
  
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
    taskDate: "",
    resumePath: "", // Stores the selected resume path string from repository pool
  });

  // Fetch the available resume list when the form workspace initializes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await API.get("/auth/resumes");
        if (res.data.success) {
          setResumePool(res.data.resumes);
        }
      } catch (err) {
        console.error("Could not load repository resumes pool options.");
      }
    };
    fetchResumes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Sent cleanly as a regular standard JSON payload object!
      const res = await API.post("/interviews", formData);
      if (res.data.success) {
        toast.success("Application tracked successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create application entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto selection:bg-indigo-500 selection:text-white">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Applications
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Track New Application</h2>
          <p className="text-sm text-slate-400 mt-1">Add details about an active job prospect to manage its progress.</p>
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
                  placeholder="e.g., Google"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
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
                  placeholder="e.g., SDE Intern"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
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

          {/* Task Scheduler Input Section */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Set Reminder / Deadline Milestone (Optional)
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

          {/* --- NEW RESUME POOL SELECTION DROPDOWN FIELD --- */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Link Resume From Repository Pool
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

          {/* Notes Textarea Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Additional Notes</label>
            <div className="relative">
              <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
              <textarea
                rows="4"
                placeholder="Include preparation strategies, salary range token data parameters..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ml-auto"
          >
            <Save className="w-4 h-4" /> {submitting ? "Saving Entry..." : "Save Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInterview;