
const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 py-10 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center justify-center">
                    {/* Brand/Copyright */}
                    <div className="text-slate-400 text-sm font-medium text-center">
                        &copy; {new Date().getFullYear()} Visioneries | <span className="text-[#5CB85C] font-bold">Eventify</span>. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;