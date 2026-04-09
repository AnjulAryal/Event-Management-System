export default function UserEmptyState({ icon, title, description }) {
    return (
        <div className="text-center py-20 md:py-32 bg-white rounded-[32px] border-2 border-dashed border-slate-100 animate-in zoom-in duration-500">
            <div className="text-6xl mb-6 grayscale opacity-30">{icon}</div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
            <p className="text-slate-400 mt-2 font-medium max-w-md mx-auto">{description}</p>
        </div>
    );
}
