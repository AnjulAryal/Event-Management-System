export default function HelpHeader({ title, subtitle }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{title}</h2>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {subtitle}
            </h1>
        </div>
    );
}
