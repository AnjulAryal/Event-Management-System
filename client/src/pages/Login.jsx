import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate();

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
        }

        setErrors(newErrors);
        if (!valid) return;

        setLoading(true);
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save in localStorage for ProtectedRoute to access
            localStorage.setItem('user', JSON.stringify(data));
            
            toast.success(`Logged in as ${data.isAdmin ? 'Admin' : 'User'}!`);

            // Redirect based on role
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
                        <Input 
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            icon={Mail}
                            error={errors.email}
                        />

                        {/* Password */}
                        <Input 
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={Lock}
                            error={errors.password}
                        />

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
        </div>
    );
};

export default Login;