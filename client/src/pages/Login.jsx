import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    // Password validation regex
    const validatePassword = (pwd) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = { email: '', password: '' };
        let valid = true;

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'Enter a valid email';
            valid = false;
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (!validatePassword(password)) {
            newErrors.password =
                'Password must be 8+ chars, include uppercase, lowercase, number & special char';
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        setLoading(true);
        try {
            await login(email, password); // Make sure your login function exists
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
            {/* Softer green blurred circles */}
            <div className="absolute -top-16 -left-16 w-[30vw] h-[30vw] bg-[#5CB85C] rounded-full opacity-15 blur-3xl"></div>
            <div className="absolute -bottom-16 -right-16 w-[30vw] h-[30vw] bg-[#5CB85C] rounded-full opacity-15 blur-3xl"></div>

            {/* Centered card */}
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
                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@example.com"
                                    className={`w-full bg-gray-100 border rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 transition
                    ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5CB85C]/20'}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-gray-100 border rounded-lg py-3 pl-10 pr-10 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 transition
                    ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5CB85C]/20'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                to="/reset-password"
                                className="text-xs font-extrabold tracking-widest text-[#5CB85C] hover:text-[#4AA14A] transition"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5CB85C] text-white py-3 sm:py-4 rounded-lg font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:bg-[#4AA14A] active:scale-95 transition"
                        >
                            {loading ? 'Logging in...' : (
                                <>
                                    Log In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                    {/* Sign Up Link */}
                            <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-extrabold text-[#5CB85C] hover:text-[#4AA14A] transition"
                            >
                            Create an account
                            </Link>
                            </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;