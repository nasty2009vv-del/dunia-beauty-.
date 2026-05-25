'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { User, Mail, Lock, Heart, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { user, isAdmin, login, signup, loading: authLoading } = useAuth();
  const { dict, lang, isRtl } = useLanguage();
  const router = useRouter();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user && !authLoading) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError(dict.invalidForm);
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isLoginMode ? 'Failed to log in.' : 'Failed to sign up.'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50/50 hover:bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100 transition-all duration-200"
        >
          {isRtl ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
          <span>{dict.backToHome}</span>
        </button>

        {/* Card Container */}
        <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-md p-6 sm:p-8 space-y-6 relative">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-100/40 blur-xl" />
          <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-rose-100/40 blur-xl" />

          {/* Logo / Header */}
          <div className="relative text-center space-y-2">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-500 shadow-sm border border-pink-100/50 animate-pulse">
              <Heart className="h-6 w-6 fill-pink-400 text-pink-400" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-800">
              {isLoginMode ? dict.login : dict.signup}
            </h2>
            <p className="text-xs text-neutral-500 font-medium max-w-[250px] mx-auto leading-relaxed">
              {lang === 'ar' ? 'سجلي الدخول لتعديل المنتجات وإدارتها بسهولة' : 'Sign in to access admin privileges and update the shop.'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs sm:text-sm text-rose-700">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                {dict.email}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-neutral-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 bg-pink-50/10 py-2.5 pe-4 ps-10 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                {dict.password}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-neutral-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 bg-pink-50/10 py-2.5 pe-4 ps-10 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {!isLoginMode && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  {dict.confirmPassword}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-pink-100 bg-pink-50/10 py-2.5 pe-4 ps-10 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-pink-600 hover:to-rose-500 hover:shadow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99] pt-3.5 pb-3.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{dict.loading}</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span>{isLoginMode ? dict.login : dict.signup}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode Link */}
          <div className="text-center text-xs text-neutral-500 border-t border-pink-50 pt-4">
            <span className="font-medium">
              {isLoginMode ? dict.dontHaveAccount : dict.alreadyHaveAccount}{' '}
            </span>
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="font-bold text-pink-600 hover:text-pink-700 hover:underline transition-colors"
            >
              {isLoginMode ? dict.signup : dict.login}
            </button>
          </div>

          {/* Mock Mode Tip */}
          <div className="rounded-2xl bg-pink-50/40 border border-pink-100/50 p-3 text-[11px] text-pink-700 leading-relaxed space-y-1">
            <span className="font-bold block">💡 {lang === 'ar' ? 'نصيحة المسؤول للمعاينة السريعة:' : 'Admin Testing Hint (Mock Mode):'}</span>
            <span>
              {lang === 'ar' 
                ? 'استخدم البريد admin@dunia.com مع كلمة مرور admin123 لتسجيل الدخول كمسؤول فوراً!' 
                : 'Log in with admin@dunia.com and password admin123 to instantly check the admin dashboard!'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
