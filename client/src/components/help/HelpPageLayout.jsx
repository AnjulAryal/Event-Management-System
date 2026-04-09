export default function HelpPageLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans pb-20 overflow-x-hidden">
            <div className="max-w-[1000px] mx-auto px-6 py-10 md:py-16">
                {children}
            </div>
        </div>
    );
}
