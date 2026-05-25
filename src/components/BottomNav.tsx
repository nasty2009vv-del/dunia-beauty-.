'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthProvider';
import { Home, Sparkles, Palette, Moon, Lock, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { dict } = useLanguage();
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? 'text-pink-600' 
      : 'text-neutral-400 hover:text-pink-400';
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-pink-100 bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_16px_rgba(244,63,94,0.06)]">
      <div className="mx-auto flex h-full max-w-md items-center justify-around px-2">
        
        {/* Home */}
        <Link href="/" className={`flex flex-col items-center justify-center w-12 h-full transition-all duration-200 ${isActive('/')}`}>
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">{dict.home}</span>
        </Link>

        {/* Perfumes */}
        <Link href="/categories/perfumes" className={`flex flex-col items-center justify-center w-12 h-full transition-all duration-200 ${isActive('/categories/perfumes')}`}>
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">{dict.perfumes}</span>
        </Link>

        {/* Makeup */}
        <Link href="/categories/makeup" className={`flex flex-col items-center justify-center w-12 h-full transition-all duration-200 ${isActive('/categories/makeup')}`}>
          <Palette className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">{dict.makeup}</span>
        </Link>

        {/* Pajamas */}
        <Link href="/categories/pajamas" className={`flex flex-col items-center justify-center w-12 h-full transition-all duration-200 ${isActive('/categories/pajamas')}`}>
          <Moon className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">{dict.pajamas}</span>
        </Link>

        {/* Admin Dashboard / Login */}
        {isAdmin ? (
          <Link href="/admin" className={`flex flex-col items-center justify-center w-12 h-full transition-all duration-200 ${isActive('/admin')}`}>
            <Lock className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">{dict.adminLink}</span>
          </Link>
        ) : (
          <Link href={user ? '/' : '/login'} className={`flex flex-col items-center justify-center w-12 h-full transition-all duration-200 ${user ? 'text-neutral-400' : isActive('/login')}`}>
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">
              {user ? (dict.hello + '!') : dict.login}
            </span>
          </Link>
        )}

      </div>
    </div>
  );
};
