import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart3, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Loader2,
  CalendarDays
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/api/interviews/analytics");
        if (response.data.success) {
          setData(response.data.analytics);
        } else {
          setError("Failed to load analytics data.");
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError(err.response?.data?.message || "An error occurred while fetching analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Calculating metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-rose-400 p-6">
        <div className="bg-rose-500/10 border border-rose-500/20 px-6 py-4 rounded-xl text-sm">
          {error}
        </div>
      </div>
    );
  }

  const COLORS = {
    Applied: "#3b82f6",
    OA: "#d97706",
    Interview: "#8b5cf6",
    Offer: "#10b981",
    Rejected: "#ef4444"
  };

  const pieChartData = data.statusDistribution.filter(item => item.count > 0);
  const monthlyData = data.monthlyApplications || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-slate-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          Application Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          A real-time performance breakdown of your recruitment pipelines.
        </p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Sent</span>
            <h3 className="text-3xl font-bold text-white">{data.totalApplications}</h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Process</span>
            <h3 className="text-3xl font-bold text-white">{data.activeApplications}</h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Offers Won</span>
            <h3 className="text-3xl font-bold text-emerald-400">{data.offerCount}</h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-emerald-400/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interview Rate</span>
            <h3 className="text-3xl font-bold text-white">{data.interviewRate}%</h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ROW 1: Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recharts Pie Chart Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Status Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Visual stage matching of all logged application metrics.</p>
          </div>
          
          <div className="h-72 mt-4 w-full flex items-center justify-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65} 
                    outerRadius={95} 
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.status] || "#cbd5e1"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No application stages logged to generate chart.</p>
            )}
          </div>
        </div>

        {/* Monthly Trends Bar Chart Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Applications Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Application submission frequency mapped over months.</p>
          </div>
          
          <div className="h-72 mt-4 w-full flex items-center justify-center">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ReChartsBarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                    itemStyle={{ color: "#6366f1" }}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Applications" 
                    fill="#6366f1" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={40}
                  />
                </ReChartsBarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No historical monthly data recorded yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* ROW 2: Velocity and Funnel Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Application Velocity Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Application Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Recent timeline milestones.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-auto">
            <div className="bg-slate-800/40 border border-slate-800/80 p-5 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">This Month</span>
              <span className="text-3xl font-bold text-white bg-slate-800/60 px-4 py-1.5 rounded-lg inline-block">
                {data.applicationsThisMonth}
              </span>
            </div>
            <div className="bg-slate-800/40 border border-slate-800/80 p-5 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">This Year</span>
              <span className="text-3xl font-bold text-indigo-400 bg-slate-800/60 px-4 py-1.5 rounded-lg inline-block">
                {data.applicationsThisYear}
              </span>
            </div>
          </div>
          
          <div className="hidden lg:block text-[11px] text-slate-500 mt-4 text-center">
            Pacing intervals calculated relative to your system date.
          </div>
        </div>

        {/* Conversion Funnel Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white">Conversion Funnel</h3>
            <p className="text-xs text-slate-400 mt-0.5">Calculated relative efficiency metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* OA Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-medium text-slate-400">OA Progress</span>
                <span className="text-sm font-bold text-amber-500">{data.oaRate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data.oaRate}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-500">Ratio of total invitations received.</p>
            </div>

            {/* Offer Conversion Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-medium text-slate-400">Offer Success</span>
                <span className="text-sm font-bold text-indigo-400">{data.offerConversionRate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${data.offerConversionRate}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-500">Conversion from interview phase.</p>
            </div>

            {/* Rejection Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-medium text-slate-400">Rejection Rate</span>
                <span className="text-sm font-bold text-rose-500">{data.rejectionRate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${data.rejectionRate}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-500">Overall closing fallout density.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;