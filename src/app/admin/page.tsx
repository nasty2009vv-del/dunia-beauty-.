'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { AdminProductForm } from '@/components/AdminProductForm';
import { getProducts, deleteProduct, Product } from '@/lib/db';
import { 
  Lock, 
  Trash2, 
  Plus, 
  Phone, 
  UserCheck, 
  ShoppingBag, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  LogOut,
  Mail,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, adminEmails, addAdminEmail, logout, loading: authLoading } = useAuth();
  const { dict, lang, isRtl } = useLanguage();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [whatsappPhone, setWhatsappPhone] = useState('966500000000');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle redirects and auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load products and settings
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAdmin) return;

      setLoadingProducts(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products for admin:", err);
      } finally {
        setLoadingProducts(false);
      }

      // Load WhatsApp number from localStorage
      if (typeof window !== 'undefined') {
        const storedPhone = localStorage.getItem('dunia_beauty_whatsapp_phone');
        if (storedPhone) {
          setWhatsappPhone(storedPhone);
        }
      }
    };

    loadDashboardData();
  }, [isAdmin]);

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const cleanPhone = whatsappPhone.replace('+', '').replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg(lang === 'ar' ? 'رقم الهاتف غير صالح.' : 'Invalid phone number format.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('dunia_beauty_whatsapp_phone', cleanPhone);
      setWhatsappPhone(cleanPhone);
      setSuccessMsg(lang === 'ar' ? 'تم حفظ رقم الهاتف بنجاح!' : 'WhatsApp number saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      setErrorMsg(lang === 'ar' ? 'بريد إلكتروني غير صالح.' : 'Invalid email address.');
      return;
    }

    try {
      await addAdminEmail(newAdminEmail.trim().toLowerCase());
      setSuccessMsg(lang === 'ar' ? 'تمت إضافة المسؤول بنجاح!' : 'Admin email added successfully!');
      setNewAdminEmail('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(lang === 'ar' ? 'فشل إضافة المسؤول.' : 'Failed to add admin.');
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
        <span className="text-sm font-semibold text-neutral-500">{dict.loading}</span>
      </div>
    );
  }

  // Not logged in (handled by redirection, but safe render)
  if (!user) {
    return null;
  }

  // Logged in but not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-rose-100 bg-white p-6 sm:p-8 text-center space-y-5 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800">{dict.accessDenied}</h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{dict.notAdminError}</p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => router.push('/')}
              className="rounded-xl border border-pink-100 bg-pink-50/50 py-2.5 px-4 text-xs font-semibold text-pink-600 hover:bg-pink-100 transition-colors"
            >
              {dict.backToHome}
            </button>
            <button
              onClick={logout}
              className="rounded-xl bg-rose-600 py-2.5 px-4 text-xs font-semibold text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>{dict.logout}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const outOfStockCount = products.filter(p => p.quantity <= 0).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Header and stats */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-800">{dict.adminDashboard}</h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">{dict.welcomeAdmin}</p>
          </div>
          
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50/50 px-4 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700 self-start sm:self-auto transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{dict.logout}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total products */}
          <div className="rounded-2xl border border-pink-100 bg-white p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">
                {lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
              </span>
              <span className="text-2xl font-black text-pink-600">{products.length}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-500 shadow-inner">
              <ShoppingBag className="h-5 w-5" />
            </span>
          </div>

          {/* Out of Stock */}
          <div className="rounded-2xl border border-pink-100 bg-white p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">
                {lang === 'ar' ? 'نفذ من المخزن' : 'Out of Stock'}
              </span>
              <span className={`text-2xl font-black ${outOfStockCount > 0 ? 'text-rose-500' : 'text-neutral-700'}`}>
                {outOfStockCount}
              </span>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-full shadow-inner ${
              outOfStockCount > 0 ? 'bg-rose-50 text-rose-500' : 'bg-neutral-50 text-neutral-400'
            }`}>
              <AlertTriangle className="h-5 w-5" />
            </span>
          </div>

          {/* WhatsApp Settings Link */}
          <div className="rounded-2xl border border-pink-100 bg-white p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">
                {lang === 'ar' ? 'رقم طلبات الواتساب' : 'WhatsApp Orders'}
              </span>
              <span className="text-sm font-extrabold text-neutral-700 truncate max-w-[150px] block">
                +{whatsappPhone}
              </span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
              <Phone className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Side: Add Product Form and Settings */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Add Product Form */}
          <AdminProductForm onProductAdded={handleProductAdded} />

          {/* Configuration Forms */}
          <div className="rounded-2xl border border-pink-100 bg-white p-5 sm:p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 border-b border-pink-50 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                <Phone className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-neutral-800">
                {lang === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}
              </h3>
            </div>

            {/* Error/Success Feedbacks */}
            {successMsg && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-700 font-semibold">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-700 font-semibold">
                {errorMsg}
              </div>
            )}

            {/* WhatsApp Number setting */}
            <form onSubmit={handleSavePhone} className="space-y-2">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                {lang === 'ar' ? 'رقم هاتف الواتساب (بالرمز الدولي)' : 'WhatsApp Phone (International Code)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="flex-1 rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
                  placeholder="e.g. 966500000000"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-bold text-white hover:bg-pink-600 transition-colors shadow-sm"
                >
                  {lang === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>

            {/* Admin Emails setting */}
            <form onSubmit={handleAddAdmin} className="space-y-2 border-t border-dashed border-pink-50 pt-4">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                {lang === 'ar' ? 'إضافة مسؤول جديد (بريد إلكتروني)' : 'Add New Admin (Email)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
                  placeholder="admin@example.com"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-bold text-white hover:bg-pink-600 transition-colors shadow-sm"
                >
                  {lang === 'ar' ? 'إضافة' : 'Add'}
                </button>
              </div>

              {/* Admin list badges */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  {dict.adminEmailList}
                </span>
                <div className="flex flex-wrap gap-1">
                  {adminEmails.map((email, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-semibold text-pink-600 border border-pink-100"
                    >
                      <Mail className="h-2.5 w-2.5" />
                      <span>{email}</span>
                    </span>
                  ))}
                </div>
              </div>
            </form>

          </div>
        </div>

        {/* Right Side: Manage Products List */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 sm:p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-pink-50 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-neutral-800">
                {lang === 'ar' ? 'المنتجات الحالية' : 'Current Products'}
              </h3>
            </div>
            <span className="rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs px-2.5 py-0.5 font-bold">
              {products.length}
            </span>
          </div>

          {loadingProducts ? (
            <div className="space-y-4 py-8 text-center flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
              <span className="text-xs text-neutral-500">{dict.loading}</span>
            </div>
          ) : products.length > 0 ? (
            /* Product List Table / Grid */
            <div className="overflow-x-auto">
              <div className="min-w-[600px] divide-y divide-pink-50">
                
                {/* List Items */}
                {products.map((p) => {
                  const pName = lang === 'ar' && p.nameAr ? p.nameAr : p.name;
                  return (
                    <div key={p.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-4">
                      
                      {/* Product details */}
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.imageUrl}
                          alt={pName}
                          className="h-12 w-12 rounded-xl object-cover border border-pink-100 shadow-sm shrink-0 bg-pink-50/20"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-neutral-800 line-clamp-1">{pName}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-600 font-extrabold">{p.price} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                            <span className="text-[10px] text-neutral-400">•</span>
                            <span className="text-xs text-neutral-500 font-medium capitalize">
                              {dict[p.category] || p.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stock controls & action */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">
                            {dict.quantity}
                          </span>
                          <span className={`text-xs font-bold ${p.quantity <= 0 ? 'text-rose-500' : 'text-neutral-700'}`}>
                            {p.quantity} {p.quantity <= 0 && `(${dict.outOfStock})`}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                          title={dict.delete}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-pink-100 rounded-2xl bg-pink-50/5">
              <ShoppingBag className="h-10 w-10 text-pink-300 mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-neutral-500 font-semibold">{dict.noProductsYet}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
