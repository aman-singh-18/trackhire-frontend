import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

// Modular Component Imports
import StatsCard from "../components/StatsCard";
import SearchBar from "../components/SearchBar";
import InterviewCard from "../components/InterviewCard";

// Icon Assets for the Stat Counters
import { Briefcase, Calendar, CheckCircle2, Clock, XCircle, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 });
  const [loading, setLoading] = useState(true);

  // Search, Filter, and Sorting States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Stats and Interviews from Backend
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const statsRes = await API.get("/interviews/stats");
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      const interviewsRes = await API.get(
        `/interviews?search=${search}&status=${status}&sort=${sort}&page=${page}`
      );
      
      if (interviewsRes.data.success) {
        setInterviews(interviewsRes.data.interviews);
        setTotalPages(interviewsRes.data.totalPages);
        setPage(interviewsRes.data.currentPage);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, status, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  // Delete Action Handler Pipeline
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application tracking card?")) {
      try {
        const res = await API.delete(`/interviews/${id}`);
        if (res.data.success) {
          toast.success("Application deleted successfully");
          fetchData();
        }
      } catch (err) {
        toast.error("Failed to delete interview entry");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 selection:bg-indigo-500 selection:text-white">
      
      {/* Header Profile Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome, {user?.name || "Developer"} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here is your interview application lifecycle overview.
        </p>
      </div>

      {/* Aggregate Stats Section Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total" count={stats.total} icon={BarChart3} colorClass="bg-indigo-500/10 text-indigo-400" />
        <StatsCard title="Applied" count={stats.Applied} icon={Clock} colorClass="bg-blue-500/10 text-blue-400" />
        <StatsCard title="OA" count={stats.OA} icon={Calendar} colorClass="bg-amber-500/10 text-amber-400" />
        <StatsCard title="Interview" count={stats.Interview} icon={Briefcase} colorClass="bg-purple-500/10 text-purple-400" />
        <StatsCard title="Offers" count={stats.Offer} icon={CheckCircle2} colorClass="bg-emerald-500/10 text-emerald-400" />
        <StatsCard title="Rejected" count={stats.Rejected} icon={XCircle} colorClass="bg-rose-500/10 text-rose-400" />
      </section>

      {/* Sticky Controls Panel (Pins to top when scrolling down) */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md pt-2 pb-4 z-20 space-y-4">
        <SearchBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />

        {/* Pagination Control View Tray */}
        {!loading && interviews.length > 0 && (
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
            <p className="text-xs text-slate-400 font-medium">
              Page <span className="text-white font-semibold">{page}</span> of{" "}
              <span className="text-white font-semibold">{totalPages || 1}</span>
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 transition-all active:scale-95"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Data Table Area */}
      <div className="mt-2">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl border-dashed">
            <p className="text-slate-500 text-sm">
              No tracking records match your selection parameters.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Company</th>
                    <th className="p-4">Role / Title</th>
                    <th className="p-4">Date Applied</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {interviews.map((item) => (
                    <InterviewCard
                      key={item._id}
                      item={item}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;