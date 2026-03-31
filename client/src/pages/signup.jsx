import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { Link } from "react-router-dom";

<p className="text-center text-sm text-gray-600 mt-6">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-green-600 font-medium hover:text-green-700 transition-colors"
  >
    Sign in
  </Link>
</p>
export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    
    // Simulate API call - replace with your actual API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      
      // Auto-reset after 3 seconds (optional)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-green-500">Create</span>
            <span className="text-gray-900"> Account</span>
          </h1>
          <p className="text-gray-500 text-sm">Join us and start your journey today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 border border-gray-100">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
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
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Johnathan Doe"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all ${
                      errors.fullName
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-all ${
                      errors.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
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
                    className="mt-1 flex-shrink-0 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-xs ml-8">
                    <AlertCircle className="w-4 h-4" />
                    {errors.terms}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg mt-8 flex items-center justify-center gap-2 group transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Sign In Link */}
             <p className="text-center text-sm text-gray-600 mt-6">
                 Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-extrabold text-[#5CB85C] hover:text-[#4AA14A] transition"
                >
                Sign in
                 </Link>
             </p>
            </form>
          )}
        </div>

       
      </div>
    </div>
  );
}