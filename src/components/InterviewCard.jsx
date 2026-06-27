import React from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, Eye } from "lucide-react";

const InterviewCard = ({ item, handleDelete }) => {
  return (
    <tr className="hover:bg-slate-800/40 transition-colors">
      <td className="p-4 font-semibold text-white">{item.company}</td>
      <td className="p-4 text-slate-300">{item.role}</td>
      <td className="p-4 text-slate-400">{new Date(item.appliedDate).toLocaleDateString()}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border
          ${item.status === 'Offer' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
          ${item.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
          ${item.status === 'Interview' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
          ${item.status === 'OA' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
          ${item.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
        `}>
          {item.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Link
            to={`/view/${item._id}`}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-slate-400 hover:text-teal-400 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/edit/${item._id}`}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors"
            title="Modify Record Entry"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2 bg-slate-950 hover:bg-rose-950/30 border border-slate-800/80 rounded-xl text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
            title="Purge Record Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InterviewCard;