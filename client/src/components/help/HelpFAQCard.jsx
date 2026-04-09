import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpFAQCard({ card }) {
    return (
        <div className="bg-white rounded-2xl p-6 flex gap-4 shadow-sm border border-slate-50 transform transition-all hover:translate-y-[-4px] hover:shadow-md">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: card.iconBg }}>
                {card.icon}
            </div>
            <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{card.description}</p>
                <Link to={card.link} className="text-[13px] font-bold text-[#5CB85C] flex items-center gap-1 hover:underline">
                    Learn more <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}
