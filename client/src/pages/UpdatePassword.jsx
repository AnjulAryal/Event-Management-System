import { useState } from 'react';
import { Lock, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const UpdatePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validatePassword = (pwd) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!newPassword.trim()) { newErrors.newPassword = 'Password is required'; }
        else if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Must be 8+ chars, uppercase, lowercase, number & special char';
        }

        if (!confirmPassword.trim()) { newErrors.confirmPassword = 'Please confirm your password'; }
        else if (newPassword !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Password updated successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
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
                <div className="bg-white rounded-[25px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 pt-12">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                            <span className="text-[#5CB85C]">Update</span> password 
                            <Lock className="w-6 h-6 text-[#5CB85C]" strokeWidth={2.5} />
                        </h2>
                        <p className="text-gray-500 text-xs leading-relaxed px-6">
                            Password should contain special character, capital letter and number for your account security.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <Input 
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••••••"
                            icon={Lock}
                            error={errors.newPassword}
                        />

                        {/* Confirm Password */}
                        <Input 
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            icon={Shield}
                            error={errors.confirmPassword}
                        />

                        {/* Submit Button */}
                        <Button 
                            type="submit"
                            isLoading={loading}
                            className="w-full py-4 text-base"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Update Password
                        </Button>
                    </form>

                    {/* Footer link */}
                    <div className="text-center mt-10">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5CB85C] hover:text-[#4AA14A] transition-all"
                        >
                            <ArrowLeft size={14} />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;

