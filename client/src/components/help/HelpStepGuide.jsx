export default function HelpStepGuide({ steps }) {
    return (
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 mb-12 max-w-[800px] mx-auto animate-in fade-in zoom-in duration-700">
            <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Step-by-Step Guide</h3>
            <div className="space-y-12">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-6 group">
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-[#5CB85C] flex items-center justify-center text-white font-black text-lg shadow-[0_4px_12px_rgba(92,184,92,0.3)] group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                            {index !== steps.length - 1 && (
                                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%+24px)] bg-slate-100" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {step.description}
                                {step.highlight && (
                                    <span className="text-red-500 ml-1 decoration-2 font-semibold italic">{step.highlight}</span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
