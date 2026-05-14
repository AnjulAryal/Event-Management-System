export default function UserPageContainer({ children, isMobile, header }) {
    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans flex flex-col pb-6">
            {header}
            <div className={`max-w-[1100px] mx-auto w-full px-4 md:px-7 ${isMobile ? 'py-2' : 'py-4'} animate-in fade-in duration-700 space-y-4 md:space-y-6`}>
                {children}
            </div>
        </div>
    );
}
