import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { Brain, Zap, TrendingUp, CheckCircle2, User, Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
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

    try {
      const response = await authAPI.login(formData);
      onLogin(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg font-body flex relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 border-4 border-primary opacity-10 rotate-12 pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 border-4 border-accent opacity-10 -rotate-12 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary opacity-5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent opacity-5 blur-3xl pointer-events-none"></div>

      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <div className="relative z-10 animate-slide-in-right">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-primary border-3 border-bg flex items-center justify-center shadow-brutal-sm">
              <Brain className="w-7 h-7 text-bg" strokeWidth={2.5} />
            </div>
            <span className="text-4xl font-display font-black tracking-tight">
              <span className="text-primary">MANTHAN</span>
              <span className="text-text">.AI</span>
            </span>
          </div>

          <div className="space-y-8 max-w-xl">
            <h1 className="font-display font-black text-7xl leading-none tracking-tighter stagger-1 animate-slide-in-right">
              MASTER YOUR
              <span className="block text-primary mt-2">ESSAY CRAFT</span>
            </h1>
            
            <p className="text-xl text-text-muted leading-relaxed font-body stagger-2 animate-slide-in-right">
              Transform your writing with AI-powered evaluation. Get instant, 
              detailed feedback designed for UPSC and competitive exam success.
            </p>

            <div className="space-y-4 mt-12 stagger-3 animate-slide-in-right">
              {[
                { icon: Zap, text: 'Instant AI-powered evaluations' },
                { icon: TrendingUp, text: 'Track progress with analytics' },
                { icon: CheckCircle2, text: 'Multi-criteria detailed feedback' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-surface border-2 border-border flex items-center justify-center 
                                group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-bg" />
                  </div>
                  <span className="text-lg text-text-muted group-hover:text-text transition-colors duration-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="relative z-10 stagger-4 animate-slide-in-right">
          <div className="inline-block p-4 bg-surface border-3 border-primary shadow-brutal">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-display font-black text-primary">10K+</div>
              <div className="text-sm text-text-muted uppercase font-display font-bold leading-tight">
                Essays<br/>Evaluated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md animate-slide-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary border-3 border-bg flex items-center justify-center shadow-brutal-sm">
              <Brain className="w-6 h-6 text-bg" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-display font-black">
              <span className="text-primary">MANTHAN</span>
              <span className="text-text">.AI</span>
            </span>
          </div>

          {/* Form Container */}
          <div className="bg-surface border-3 border-text p-8 md:p-10 relative shadow-elevation">
            {/* Brutal Shadow Effect */}
            <div className="absolute -bottom-3 -right-3 w-full h-full bg-primary -z-10"></div>

            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-3">
                WELCOME<br/>BACK
              </h2>
              <p className="text-text-muted text-sm font-body">
                Continue your journey to writing excellence
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error/10 border-2 border-error text-error text-sm font-display font-bold uppercase animate-slide-in-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                             focus:border-primary focus:outline-none transition-all duration-300
                             hover:border-text-dim"
                    placeholder="your_username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-3">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-bg border-2 border-border pl-12 pr-4 py-4 text-text font-body
                             focus:border-primary focus:outline-none transition-all duration-300
                             hover:border-text-dim"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-bg py-5 font-display font-black text-sm uppercase tracking-wider
                         border-3 border-bg shadow-brutal hover:shadow-brutal-hover
                         hover:translate-x-[-4px] hover:translate-y-[-4px]
                         active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In →</span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-text-muted text-sm font-body">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary font-display font-bold uppercase text-xs tracking-wider
                           hover:text-accent transition-colors duration-300 inline-block
                           relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                           after:bg-primary hover:after:bg-accent after:transition-colors"
                >
                  Create One Now →
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Tagline */}
          <p className="mt-8 text-center text-text-dim text-xs font-display uppercase tracking-wider">
            Powered by Advanced AI • Trusted by 10,000+ Writers
          </p>
        </div>
      </div>
    </div>
  );
}
