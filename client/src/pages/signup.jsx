import React, { useState } from 'react';
import { Mail, Lock, User, Check, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      
      setTimeout(() => {
        resetForm();
      }, 3000);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '' });
    setAgreedToTerms(false);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative background element */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EEF5F1] rounded-full opacity-70 blur-3xl"></div>
      
      <div className="w-full max-w-[450px] relative z-10">
        {/* Form Card */}
        <div className="bg-white rounded-[25px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="text-[#5CB85C]">EVENT</span>
              <span className="text-gray-900">IFY</span>
            </h1>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">
              Register a <span className="text-[#5CB85C]">user</span>
            </h2>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="w-8 h-8 text-[#5CB85C]" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome aboard!</h2>
              <p className="text-gray-600 text-sm">Your account has been created successfully.</p>
              <button
                onClick={resetForm}
                className="mt-6 px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Sign Up
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <Input 
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Johnathan Doe"
                icon={User}
                error={errors.fullName}
              />

              {/* Email Address */}
              <Input 
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                icon={Mail}
                error={errors.email}
              />

              {/* Password */}
              <Input 
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                icon={Lock}
                error={errors.password}
              />

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked && errors.terms) {
                        setErrors(prev => ({
                          ...prev,
                          terms: ''
                        }));
                      }
                    }}
                    className="w-5 h-5 bg-[#F3F5F9] border-none rounded-md text-[#5CB85C] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-[#A0AEC0]">
                    I agree to the{' '}
                    <a href="#" className="text-[#5CB85C] font-semibold hover:underline">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-[#5CB85C] font-semibold hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-[10px]">
                    <Check className="w-3 h-3" />
                    {errors.terms}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                isLoading={isLoading}
                className="w-full py-4 text-base"
                icon={ArrowRight}
                iconPosition="right"
              >
                Create Account
              </Button>

              {/* Log In Link */}
              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-[13px] text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#5CB85C] font-bold hover:underline ml-1"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}