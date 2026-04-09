import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 py-10 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand/Copyright */}
                    <div className="text-slate-400 text-sm font-medium order-2 md:order-1">
                        &copy; {new Date().getFullYear()} Visioneries | <span className="text-[#5CB85C] font-bold">Eventify</span>. All rights reserved.
                    </div>

                    {/* Footer Links */}
                    <div className="flex items-center gap-8 order-1 md:order-2">
                        <Link 
                            to="/help" 
                            className="text-slate-500 hover:text-[#5CB85C] text-sm font-bold transition-colors"
                        >
                            Help & Support
                        </Link>
                        <Link 
                            to="/help" 
                            className="text-slate-500 hover:text-[#5CB85C] text-sm font-bold transition-colors"
                        >
                            Contact
                        </Link>
                        <Link 
                            to="/feedback" 
                            className="text-slate-500 hover:text-[#5CB85C] text-sm font-bold transition-colors"
                        >
                            Feedback
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;