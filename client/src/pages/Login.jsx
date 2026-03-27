import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-primary-500/10 border border-white relative overflow-hidden ring-1 ring-neutral-200/50">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50"></div>

                    <div className="relative text-center mb-10">
                        <h1 className="text-4xl font-black text-neutral-900 mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-neutral-500 font-medium">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium text-neutral-900 placeholder:text-neutral-300 shadow-inner"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium text-neutral-900 placeholder:text-neutral-300 shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full py-4 bg-neutral-900 hover:bg-primary-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-neutral-900/10 hover:shadow-primary-600/30 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center relative pt-8 border-t border-neutral-100">
                        <p className="text-neutral-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-black hover:underline underline-offset-4">
                                Join Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
