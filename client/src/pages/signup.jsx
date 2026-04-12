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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        isAdmin: false, 
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser ? `Bearer ${currentUser.token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSubmitted(true);
      
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '' });
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

          {errors.api && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {errors.api}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="w-8 h-8 text-[#5CB85C]" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 text-sm">Account created for User.</p>
              <button
                onClick={resetForm}
                className="mt-6 px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Another
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

              {/* Submit Button */}
              <Button 
                type="submit"
                isLoading={isLoading}
                className="w-full py-4 text-base"
                icon={ArrowRight}
                iconPosition="right"
              >
                Register User
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}