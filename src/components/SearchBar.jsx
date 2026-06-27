import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ search, setSearch, status, setStatus, sort, setSort }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search company name..."
          className="w-full bg-slate-950/60 border border-slate-800 text-sm rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex w-full md:w-auto items-center gap-3">
        <select 
          className="bg-slate-950/60 border border-slate-800 text-sm rounded-xl py-2.5 px-4 text-slate-300 focus:outline-none focus:border-indigo-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="OA">OA (Online Assessment)</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select 
          className="bg-slate-950/60 border border-slate-800 text-sm rounded-xl py-2.5 px-4 text-slate-300 focus:outline-none focus:border-indigo-500"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;