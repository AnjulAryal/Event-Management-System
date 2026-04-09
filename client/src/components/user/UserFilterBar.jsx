import { Calendar, ChevronDown, RefreshCcw } from "lucide-react";

export default function UserFilterBar({ 
    date, setDate, 
    category, setCategory, 
    categories = [], 
    onApply, 
    onReset,
    hasActiveFilters 
}) {
    return (
        <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-slate-50 flex flex-col md:flex-row items-end gap-6 mb-8 transition-all hover:shadow-md">
            <div className="flex-1 w-full max-w-xs text-left">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block ml-1">DATE</label>
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 group focus-within:ring-2 focus-within:ring-[#5CB85C]/20 transition-all">
                    <Calendar size={14} className="text-slate-400 mr-2 group-focus-within:text-[#5CB85C]" />
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm text-slate-700 font-medium cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex-1 w-full max-w-xs text-left">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block ml-1">CATEGORY</label>
                <div className="relative">
                    <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#5CB85C]/20 transition-all"
                    >
                        <option>All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
            </div>

            <button 
                onClick={hasActiveFilters ? onReset : onApply}
                className={`inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] cursor-pointer shadow-lg px-8 py-3.5 h-auto w-full md:w-auto text-sm ${
                    hasActiveFilters 
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/50" 
                    : "bg-[#5CB85C] hover:bg-[#4AA14A] text-white shadow-green-500/20"
                }`}
            >
                {hasActiveFilters && <RefreshCcw size={14} className="mr-2" />}
                {hasActiveFilters ? "Clear Filters" : "Apply Filters"}
            </button>
        </div>
    );
}
