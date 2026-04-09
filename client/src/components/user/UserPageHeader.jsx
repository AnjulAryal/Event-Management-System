export default function UserPageHeader({ title, subtitle, highlightWord, highlightColor = "#4caf50", rightElement }) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight tracking-tight">
                    {title} {highlightWord && <span style={{ color: highlightColor }} className="uppercase">{highlightWord}</span>}
                </h1>
                {rightElement && <div>{rightElement}</div>}
            </div>
            {subtitle && (
                <p className="text-slate-500 text-sm md:text-base mt-1 font-medium select-none">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
