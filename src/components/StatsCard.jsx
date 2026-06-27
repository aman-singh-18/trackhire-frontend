import React from "react";

const StatsCard = ({ title, count, icon: Icon, colorClass }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-bold text-white mt-0.5">{count}</h3>
      </div>
    </div>
  );
};

export default StatsCard;