import { Search } from "lucide-react";

export default function UserSearch({ value, onChange, placeholder = "Search..." }) {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-sm">
            <div className="relative w-full max-w-lg group">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <Search className="w-4 h-4" />
                </span>
                <input 
                    type="text" 
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-[13px] rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all shadow-sm"
                />
            </div>
        </header>
    );
}
