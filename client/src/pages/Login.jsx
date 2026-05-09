import { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getErrorMessage, parseJsonSafe } from '../utils/safeJson';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showSuspendedModal, setShowSuspendedModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = { email: '', password: '' };
        let valid = true;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'Enter a valid email';
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        setLoading(true);
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await parseJsonSafe(response);

            if (!response.ok) {
                // Suspended account — show dedicated modal
                if (response.status === 403 && data?.suspended) {
                    setShowSuspendedModal(true);
                    return;
                }
                throw new Error(getErrorMessage(response, data, 'Login failed'));
            }

            if (!data) {
                throw new Error('Login failed: empty server response');
            }

            localStorage.setItem('user', JSON.stringify(data));
            toast.success(`Logged in as ${data.isAdmin ? 'Admin' : 'User'}!`);

            if (data.isAdmin) {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
            {/* Background blobs */}
            <div className="absolute -top-16 -left-16 w-[30vw] h-[30vw] bg-[#5CB85C] rounded-full opacity-15 blur-3xl"></div>
            <div className="absolute -bottom-16 -right-16 w-[30vw] h-[30vw] bg-[#5CB85C] rounded-full opacity-15 blur-3xl"></div>

            {/* Login card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-white flex flex-col items-center">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="flex items-center gap-1 text-2xl font-extrabold mb-4 tracking-tight">
                            <span className="text-[#5CB85C] uppercase">Event</span>
                            <span className="text-gray-900 uppercase">ify</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base">
                            Please enter your details to access your dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            icon={Mail}
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={Lock}
                            error={errors.password}
                        />

                        <div className="text-right">
                            <Link
                                to="/reset-password"
                                className="text-xs font-extrabold tracking-widest text-[#5CB85C] hover:text-[#4AA14A] transition"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full py-4 text-base"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Log In
                        </Button>
                    </form>
                </div>
            </div>

            {/* ── Suspended Account Modal ── */}
            {showSuspendedModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setShowSuspendedModal(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                        style={{ animation: 'suspendedPop 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Red header */}
                        <div className="bg-gradient-to-br from-[#e05252] to-[#b83a3a] px-6 pt-8 pb-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                <ShieldAlert size={34} className="text-white" />
                            </div>
                            <h2 className="text-white text-xl font-extrabold tracking-tight">Account Suspended</h2>
                            <p className="text-white/80 text-sm mt-1">Access has been restricted</p>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 text-center">
                            <p className="text-[#374151] text-sm leading-relaxed">
                                Your account has been <strong>suspended</strong> by an administrator.
                                You are currently unable to log in.
                            </p>
                            <p className="text-[#6b7280] text-xs mt-3 leading-relaxed">
                                If you believe this is a mistake, please contact support for assistance.
                            </p>

                            <button
                                onClick={() => setShowSuspendedModal(false)}
                                className="mt-5 w-full py-3 rounded-xl bg-[#e05252] text-white text-sm font-bold hover:bg-[#c94040] active:scale-95 transition-all"
                            >
                                Understood
                            </button>
                        </div>

                        {/* Close X */}
                        <button
                            onClick={() => setShowSuspendedModal(false)}
                            className="absolute top-3 right-3 text-white/70 hover:text-white transition"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <style>{`
                        @keyframes suspendedPop {
                            from { opacity: 0; transform: scale(0.82); }
                            to   { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default Login;
