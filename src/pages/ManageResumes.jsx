import React, { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Upload, FileText, ExternalLink, Loader2, ClipboardList, Trash2, ShieldAlert } from "lucide-react";

const ManageResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const fetchResumePool = async () => {
    try {
      const res = await API.get("/auth/resumes");
      if (res.data.success) {
        setResumes(res.data.resumes);
      }
    } catch (err) {
      toast.error("Could not fetch documents history bank.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumePool();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please attach a document file first.");
    setSubmitting(true);

    try {
      const multipartForm = new FormData();
      multipartForm.append("title", title || `Resume-${resumes.length + 1}`);
      multipartForm.append("resume", file);

      const res = await API.post("/auth/resumes", multipartForm);
      if (res.data.success) {
        toast.success("New resume added to your file locker!");
        setTitle("");
        setFile(null);
        setResumes(res.data.resumes);
      }
    } catch (err) {
      toast.error("Upload process rejected by server parameters.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Are you sure you want to completely delete this resume from your repository pool? Any interview cards currently linked to it will lose their path reference.")) return;
    
    try {
      const res = await API.delete(`/auth/resumes/${resumeId}`);
      if (res.data.success) {
        toast.success("Resume deleted successfully");
        setResumes(res.data.resumes);
      }
    } catch (err) {
      toast.error("Failed to delete the selected asset reference.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-400 gap-3">
        <Loader2 className="w-10 h-12 animate-spin text-indigo-500" />
        <p className="text-sm font-medium tracking-wide">Loading centralized file networks...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-200">
      
      {/* Page Header Introduction */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-indigo-500" />
          Document Workspace Repository
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage, upload, and control multiple variations of your technical profile credentials to assign to targeted positions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COMPONENT COLUMN: Upload canvas input panels */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl sticky top-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Upload Profile Document
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add specialized copies (e.g., Backend, Frontend, Data Analyst) to match different company criteria.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Document Description / Title
              </label>
              <input 
                type="text" 
                placeholder="e.g., SDE Core - Backend Specialization"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Upload File Stream
              </label>
              <label className="w-full flex flex-col items-center justify-center px-4 py-10 bg-slate-950/40 text-slate-400 rounded-xl border-2 border-slate-800 border-dashed tracking-wide cursor-pointer hover:bg-slate-850 hover:text-indigo-400 hover:border-indigo-500/40 transition-all text-center min-h-[140px]">
                <Upload className="w-8 h-8 text-slate-500 mb-2 transition-transform group-hover:scale-110" />
                <span className="text-xs font-medium tracking-wide max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap px-2">
                  {file ? file.name : "Click to browser files (.pdf, .jpg, .png)"}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => { if (e.target.files.length > 0) setFile(e.target.files[0]); }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-lg shadow-indigo-600/10 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? "Processing secure upload..." : "Add to Repository Pool"}
            </button>
          </form>
        </div>

        {/* RIGHT COMPONENT COLUMN: Displaying files grid arrays */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" /> Active File Locker Array ({resumes.length})
            </h3>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center p-20 bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
              <FileText className="w-10 h-10 text-slate-700" />
              <p className="max-w-md font-medium leading-relaxed">
                Your file repository locker is empty. Complete the upload form panel on the left layout to safely build your profile repository.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {resumes.map((item) => (
                <div key={item._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transition-all shadow-md group relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-indigo-600/10 text-indigo-400 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden space-y-1">
                      <h4 className="text-base font-bold text-white truncate group-hover:text-indigo-400 transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Added: {new Date(item.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3">
                    {/* Delete entry trigger hook anchor */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2.5 bg-slate-950 border border-slate-800 hover:bg-rose-950/30 hover:border-rose-900/50 text-slate-500 hover:text-rose-400 rounded-xl transition-all"
                      title="Delete profile document completely"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <a 
                      href={`${import.meta.env.VITE_API_URL}/${item.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      View Document <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ManageResumes;