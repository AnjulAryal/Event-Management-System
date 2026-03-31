import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [errors, setErrors] = useState({});

    const validatePassword = (pwd) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);

    const handleSendCode = async () => {
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setErrors((prev) => ({ ...prev, email: 'Enter a valid email first' }));
            return;
        }
        setErrors((prev) => ({ ...prev, email: '' }));
        setSendingCode(true);
        try {
            // await sendResetCode(email);
            toast.success('Verification code sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send code');
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let valid = true;

        if (!email.trim()) { newErrors.email = 'Email is required'; valid = false; }
        else if (!/^\S+@\S+\.\S+$/.test(email)) { newErrors.email = 'Enter a valid email'; valid = false; }

        if (!code.trim()) { newErrors.code = 'Verification code is required'; valid = false; }
        else if (!/^\d{6}$/.test(code)) { newErrors.code = 'Enter a valid 6-digit code'; valid = false; }

        if (!newPassword.trim()) { newErrors.newPassword = 'Password is required'; valid = false; }
        else if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Password must be 8+ chars, include uppercase, lowercase, number & special char';
            valid = false;
        }

        if (!confirmPassword.trim()) { newErrors.confirmPassword = 'Please confirm your password'; valid = false; }
        else if (newPassword !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; valid = false; }

        setErrors(newErrors);
        if (!valid) return;

        setLoading(true);
        try {
            // await resetPassword(email, code, newPassword);
            toast.success('Password updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
            {/* Green blurred circles — same as Login */}
            <div className="absolute -top-16 -left-16 w-[30vw] h-[30vw] bg-[#5CB85C] rounded-full opacity-15 blur-3xl"></div>
            <div className="absolute -bottom-16 -right-16 w-[30vw] h-[30vw] bg-[#5CB85C] rounded-full opacity-15 blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-white flex flex-col items-center">

                    {/* Logo */}
                    <div className="flex items-center gap-1 text-2xl font-extrabold mb-6 tracking-tight">
                        <span className="text-[#5CB85C] uppercase">Event</span>
                        <span className="text-gray-900 uppercase">ify</span>
                    </div>

                    {/* Heading */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
                            <span className="text-[#5CB85C]">Reset</span>
                            <span className="text-gray-900">Password</span>
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base">
                            Provide your email to receive a verification code
                            <br />and secure your Eventify account.
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

                        {/* Verification Code */}
                        <div className="flex flex-col">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1 mb-1">
                                Verification Code
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/, '').slice(0, 6))}
                                        placeholder="6-digit code"
                                        className={`w-full bg-gray-100 border rounded-lg py-3 pl-10 pr-4 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 transition
                                            ${errors.code ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5CB85C]/20'}`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={sendingCode}
                                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-extrabold text-gray-800 hover:bg-gray-50 active:scale-95 transition whitespace-nowrap shadow-sm"
                                >
                                    {sendingCode ? 'Sending...' : 'Send Code'}
                                </button>
                            </div>
                            {errors.code && <p className="text-red-500 text-xs mt-1 ml-1">{errors.code}</p>}
                        </div>

                        {/* New Password + Confirm Password — side by side */}
                        <div className="flex gap-3">
                            {/* New Password */}
                            <div className="flex flex-col flex-1">
                                <label className="text-xs font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full bg-gray-100 border rounded-lg py-3 pl-10 pr-10 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 transition
                                            ${errors.newPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5CB85C]/20'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.newPassword}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col flex-1">
                                <label className="text-xs font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full bg-gray-100 border rounded-lg py-3 pl-10 pr-10 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 transition
                                            ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5CB85C]/20'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5CB85C] text-white py-3 sm:py-4 rounded-lg font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:bg-[#4AA14A] active:scale-95 transition"
                        >
                            {loading ? 'Updating...' : (
                                <>
                                    Update Password <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-xs font-extrabold tracking-widest text-[#5CB85C] hover:text-[#4AA14A] transition inline-flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;