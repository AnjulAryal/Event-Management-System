import { Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function HelpFooter() {
    return (
        <div className="bg-[#2D332D] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-xl animate-in slide-in-from-bottom duration-700">
            <div>
                <h3 className="text-3xl font-black mb-2">Still need help?</h3>
                <p className="text-slate-400 font-medium">
                    Our support team is available 24/7 for complex registration issues.
                </p>
            </div>
            <Link to="/help">
                <Button 
                    className="bg-[#5CB85C] hover:bg-[#4ea64e] border-none text-slate-900 font-black px-8 py-6 rounded-2xl h-auto"
                    icon={Headphones}
                >
                    Contact US
                </Button>
            </Link>
        </div>
    );
}
