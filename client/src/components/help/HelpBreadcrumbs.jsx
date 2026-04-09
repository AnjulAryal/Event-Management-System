import { ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpBreadcrumbs({ currentPage }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500">
                <Link to="/help" className="hover:text-slate-900 transition-colors">Help & Support</Link>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="text-slate-900 font-semibold">{currentPage}</span>
            </nav>
            <Link 
                to="/help" 
                className="flex items-center gap-2 text-[#5CB85C] font-bold text-sm hover:underline"
            >
                <ArrowLeft size={16} />
                Back to Help & Support
            </Link>
        </div>
    );
}
