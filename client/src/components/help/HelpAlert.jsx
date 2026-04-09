import { CheckCircle2 } from "lucide-react";

export default function HelpAlert({ message }) {
    return (
        <div className="bg-[#f0fdf4] border-l-4 border-[#5CB85C] p-6 rounded-r-2xl mb-12 flex items-start gap-4 shadow-sm animate-in slide-in-from-left duration-500">
            <CheckCircle2 className="text-[#5CB85C] flex-shrink-0 mt-0.5" size={20} />
            <p className="text-[#3a7c3a] font-medium leading-relaxed">
                {message}
            </p>
        </div>
    );
}
