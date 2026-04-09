export default function UserPageContainer({ children, isMobile }) {
    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans pb-6">
            <div className={`max-w-[1100px] mx-auto px-4 md:px-7 ${isMobile ? 'py-2' : 'py-4'} animate-in fade-in duration-700 space-y-4 md:space-y-6`}>
                {children}
            </div>
        </div>
    );
}
