import { useState } from 'react';
import { Mail, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setErrors((prev) => ({ ...prev, email: 'Enter a valid email' }));
            return;
        }
        setErrors((prev) => ({ ...prev, email: '' }));
        setSendingCode(true);
        try {
            const response = await fetch('/api/users/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send code');
            }

            toast.success('Verification code sent to your email!');
        } catch (error) {
            toast.error(error.message || 'Failed to send code');
        } finally {
            setSendingCode(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!email.trim()) { newErrors.email = 'Email is required'; }
        else if (!/^\S+@\S+\.\S+$/.test(email)) { newErrors.email = 'Enter a valid email'; }
        
        if (!code.trim()) { newErrors.code = 'Code is required'; }
        else if (!/^\d{6}$/.test(code)) { newErrors.code = 'Enter 6-digit code'; }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const response = await fetch('/api/users/verifycode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid code');
            }

            toast.success('Code verified successfully!');
            // Store email in localStorage for UpdatePassword component
            localStorage.setItem('resetEmail', email);
            navigate('/update-password');
        } catch (error) {
            toast.error(error.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
            {/* Soft decorative blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EEF5F1] rounded-full opacity-70 blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#EEF5F1] rounded-full opacity-70 blur-3xl"></div>

            <div className="w-full max-w-[450px] relative z-10">
                <div className="bg-white rounded-[25px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
                    
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tight">
                            <span className="text-[#5CB85C]">EVENT</span>
                            <span className="text-gray-900">IFY</span>
                        </h1>
                    </div>

                    {/* Step Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            <span className="text-[#5CB85C]">Reset</span> Password
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed px-4">
                            Provide your email to receive a verification code and secure your Eventify account.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* Email Field with Send Code Button */}
                        <Input 
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            icon={Mail}
                            error={errors.email}
                            className="pr-32"
                            rightElement={
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={sendingCode}
                                    className="px-4 py-2 bg-white rounded-lg text-[10px] font-bold text-slate-700 border border-slate-100 shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    {sendingCode ? 'Sending...' : 'Send Code'}
                                </button>
                            }
                        />

                        {/* Verification Code */}
                        <Input 
                            label="Verification Code"
                            type="text"
                            maxLength="6"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/, ''))}
                            placeholder="6-digit code"
                            icon={Shield}
                            error={errors.code}
                        />

                        {/* Verify Button */}
                        <Button 
                            type="submit"
                            isLoading={loading}
                            className="w-full py-4 text-base"
                        >
                            Verify
                        </Button>
                    </form>

                    {/* Footer Link */}
                    <div className="text-center pt-8 mt-8 border-t border-gray-100">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5CB85C] hover:text-[#4AA14A] transition-all"
                        >
                            <ArrowLeft size={14} />
                            Back to Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;