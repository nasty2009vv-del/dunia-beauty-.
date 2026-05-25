'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/db';
import { Search, Sparkles, ArrowLeft, ArrowRight, Heart } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams() as { category: string };
  const { dict, lang, isRtl } = useLanguage();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Validate category slug
  const isValidCategory = ['perfumes', 'makeup', 'pajamas'].includes(category);

  useEffect(() => {
    if (!isValidCategory) {
      router.push('/');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        // Filter by specific category
        const categoryData = data.filter(p => p.category === category);
        setProducts(categoryData);
      } catch (error) {
        console.error("Failed to load products for category:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, isValidCategory, router]);

  if (!isValidCategory) {
    return null;
  }

  // Filter products by search query
  const filteredProducts = products.filter((product) => {
    const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.descriptionAr && product.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getCategoryTitle = () => {
    switch (category) {
      case 'perfumes': return dict.perfumes;
      case 'makeup': return dict.makeup;
      case 'pajamas': return dict.pajamas;
      default: return category;
    }
  };

  const getCategoryHeaderStyles = () => {
    switch (category) {
      case 'perfumes':
        return 'from-purple-100 via-rose-50 to-purple-200/50 border-purple-100';
      case 'makeup':
        return 'from-pink-100 via-rose-50 to-pink-200/50 border-pink-100';
      case 'pajamas':
        return 'from-rose-100 via-rose-50 to-rose-200/50 border-rose-100';
      default:
        return 'from-pink-100 to-rose-100 border-pink-100';
    }
  };

  const getCategoryDesc = () => {
    if (category === 'perfumes') {
      return lang === 'ar' 
        ? 'عطور فريدة فواحة تدوم طويلاً، تناسب كافة الأذواق والمناسبات السعيدة.'
        : 'Unique, long-lasting fragrances designed to evoke elegance on every occasion.';
    } else if (category === 'makeup') {
      return lang === 'ar'
        ? 'مستحضرات تجميل راقية لإبراز سحر ملامحك بكل رقة ونعومة.'
        : 'Premium cosmetic essentials selected to enhance your natural beauty with ease.';
    } else {
      return lang === 'ar'
        ? 'بيجامات ساتان حريرية وناعمة، تمنحكِ الراحة التامة ليلاً ونهاراً.'
        : 'Silky smooth pajamas and loungewear, ensuring ultimate comfort day and night.';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Back navigation & Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50/50 hover:bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100 self-start transition-colors duration-200"
        >
          {isRtl ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
          <span>{dict.backToHome}</span>
        </button>

        {/* Category Hero Banner */}
        <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getCategoryHeaderStyles()} p-6 sm:p-8 text-start shadow-sm border`}>
          <div className="relative max-w-xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 flex items-center gap-2">
              <Heart className="h-6 w-6 fill-pink-500 text-pink-500 animate-pulse" />
              <span>{getCategoryTitle()}</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {getCategoryDesc()}
            </p>
          </div>
        </section>
      </div>

      {/* Filter and Search Bar Section */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-pink-100/50 pb-4">
          <h2 className="text-sm sm:text-base font-bold text-neutral-800">
            {lang === 'ar' ? 'المنتجات المتوفرة' : 'Available Products'} ({filteredProducts.length})
          </h2>

          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-neutral-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={dict.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-pink-100 bg-white py-2.5 pe-4 ps-10 text-xs text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex flex-col overflow-hidden rounded-2xl border border-pink-50 bg-white p-3 space-y-3 animate-pulse">
                <div className="aspect-square w-full rounded-xl bg-pink-100/50" />
                <div className="h-4 w-3/4 rounded bg-pink-100/50" />
                <div className="h-3 w-full rounded bg-pink-100/50" />
                <div className="h-3 w-1/2 rounded bg-pink-100/50" />
                <div className="h-8 w-full rounded-xl bg-pink-100/50" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 rounded-3xl bg-pink-50/10 border border-dashed border-pink-100/70">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-400 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-700 mb-1">
              {lang === 'ar' ? 'القسم فارغ حالياً' : 'Category is Empty'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mb-4">
              {dict.emptyState}
            </p>
            <button
              onClick={() => router.push('/')}
              className="rounded-full bg-pink-100 px-5 py-2 text-xs font-semibold text-pink-600 hover:bg-pink-200 transition-colors"
            >
              {dict.backToHome}
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
