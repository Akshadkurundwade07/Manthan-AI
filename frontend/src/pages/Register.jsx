import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { Brain, User, Mail, Lock, UserCircle, Sparkles } from 'lucide-react';

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      // Auto login after registration
      const loginResponse = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });
      onRegister(loginResponse.data.access_token, loginResponse.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg font-body flex items-center justify-center p-8 relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute top-10 right-10 w-80 h-80 border-4 border-accent opacity-10 rotate-6 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 border-4 border-primary opacity-10 -rotate-6 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-accent opacity-5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 animate-slide-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-primary border-3 border-bg flex items-center justify-center shadow-brutal-sm relative">
            <Brain className="w-7 h-7 text-bg" strokeWidth={2.5} />
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-accent animate-pulse" />
          </div>
          <span className="text-4xl font-display font-black">
            <span className="text-primary">MANTHAN</span>
            <span className="text-text">.AI</span>
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-surface border-3 border-text p-8 md:p-12 relative shadow-elevation">
          {/* Brutal Shadow */}
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-accent -z-10"></div>

          <div className="mb-10 text-center">
            <h2 className="text-5xl md:text-6xl font-display font-black tracking-tight mb-4">
              START YOUR<br/>
              <span className="text-accent">JOURNEY</span>
            </h2>
            <p className="text-text-muted text-base font-body">
              Join 10,000+ writers mastering their craft with AI
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border-2 border-error text-error text-sm font-display font-bold uppercase animate-slide-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                  Full Name
                </label>
                <div className="relative group">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                             focus:border-accent focus:outline-none transition-all duration-300
                             hover:border-text-dim"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                             focus:border-accent focus:outline-none transition-all duration-300
                             hover:border-text-dim"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                           focus:border-accent focus:outline-none transition-all duration-300
                           hover:border-text-dim"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                             focus:border-accent focus:outline-none transition-all duration-300
                             hover:border-text-dim"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                             focus:border-accent focus:outline-none transition-all duration-300
                             hover:border-text-dim"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-bg py-5 font-display font-black text-sm uppercase tracking-wider
                       border-3 border-bg shadow-brutal-accent hover:shadow-brutal-hover
                       hover:translate-x-[-4px] hover:translate-y-[-4px]
                       active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:transform-none flex items-center justify-center gap-3 mt-8"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account →</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-text-muted text-sm font-body">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent font-display font-bold uppercase text-xs tracking-wider
                         hover:text-primary transition-colors duration-300 inline-block
                         relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                         after:bg-accent hover:after:bg-primary after:transition-colors"
              >
                Sign In Instead →
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="mt-8 text-center text-text-dim text-xs font-display uppercase tracking-wider">
          Free Forever • No Credit Card Required • Start Writing Today
        </p>
      </div>
    </div>
  );
}
