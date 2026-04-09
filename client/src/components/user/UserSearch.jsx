import { Search } from "lucide-react";

export default function UserSearch({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className="relative mb-4">
            <div className="flex items-center bg-white rounded-full py-2.5 px-6 gap-3 shadow-sm border border-slate-50 focus-within:ring-4 focus-within:ring-[#5CB85C]/10 transition-all">
                <Search size={18} className="text-slate-300" />
                <input 
                    type="text" 
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border-none outline-none flex-1 text-sm text-slate-700 bg-transparent placeholder-slate-300 font-medium"
                />
            </div>
        </div>
    );
}
