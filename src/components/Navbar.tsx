'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthProvider';
import { Languages, User, Lock, LogOut, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { dict, toggleLanguage, lang } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-pink-600 font-semibold bg-pink-50' : 'text-neutral-600 hover:text-pink-500 hover:bg-pink-50/50';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo and Name */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-500 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent">
              {dict.brandName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/')}`}
          >
            {dict.home}
          </Link>
          <Link 
            href="/categories/perfumes" 
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/categories/perfumes')}`}
          >
            {dict.perfumes}
          </Link>
          <Link 
            href="/categories/makeup" 
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/categories/makeup')}`}
          >
            {dict.makeup}
          </Link>
          <Link 
            href="/categories/pajamas" 
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/categories/pajamas')}`}
          >
            {dict.pajamas}
          </Link>
          {isAdmin && (
            <Link 
              href="/admin" 
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/admin')}`}
            >
              <Lock className="h-3.5 w-3.5" />
              {dict.adminLink}
            </Link>
          )}
        </nav>

        {/* User profile, logout, language toggle */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50/50 px-3 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300"
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* User Account / Admin Badge on Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title={dict.logout}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-pink-600 hover:to-rose-500 transition-all duration-300 hover:shadow"
              >
                <User className="h-3.5 w-3.5" />
                <span>{dict.login}</span>
              </Link>
            )}
          </div>

          {/* User Profile Info on Mobile (Icon only) */}
          <div className="flex sm:hidden items-center">
            {user ? (
              <button
                onClick={logout}
                className="p-2 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                title={dict.logout}
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            ) : (
              <Link
                href="/login"
                className="p-2 rounded-full text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                title={dict.login}
              >
                <User className="h-4.5 w-4.5" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
