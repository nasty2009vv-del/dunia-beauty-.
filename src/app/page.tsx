'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/db';
import { Search, Sparkles, SlidersHorizontal, Heart } from 'lucide-react';

export default function HomePage() {
  const { dict, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'perfumes' | 'makeup' | 'pajamas'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
    const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.descriptionAr && product.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categoriesList = [
    { id: 'all', label: dict.all },
    { id: 'perfumes', label: dict.perfumes },
    { id: 'makeup', label: dict.makeup },
    { id: 'pajamas', label: dict.pajamas },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200/50 p-6 sm:p-8 md:p-12 text-start shadow-sm border border-pink-100/50">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-300/20 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-rose-300/20 blur-2xl" />
        
        <div className="relative max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-pink-600 backdrop-blur-sm shadow-sm">
            <Heart className="h-3 w-3 fill-pink-500 text-pink-500 animate-pulse" />
            <span>{lang === 'ar' ? 'تشكيلة جديدة مميزة' : 'Brand New Collection'}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-800 leading-tight">
            {dict.brandName}
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-600 leading-relaxed">
            {lang === 'ar' 
              ? 'اكتشفي أرقى مستحضرات التجميل، العطور الفواحة، والبيجامات الحريرية فائقة النعومة. منتجات منتقاة بعناية لتناسب أناقتك وجمالكِ.' 
              : 'Discover premium makeup, captivating perfumes, and ultra-soft silk pajamas. Carefully handpicked items to celebrate your everyday elegance.'}
          </p>

          <div className="pt-2">
            <a 
              href="#products" 
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:from-pink-600 hover:to-rose-500 hover:shadow-md transition-all duration-300 transform active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>{lang === 'ar' ? 'تصفح المنتجات' : 'Shop Now'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section id="products" className="space-y-4 pt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Categories Horizontal Tabs */}
          <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold border transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-transparent shadow-sm'
                    : 'bg-white text-neutral-600 border-pink-100/70 hover:bg-pink-50/50 hover:text-pink-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

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
          /* Loading State Skeletons */
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(6)].map((_, idx) => (
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
          /* Products Grid Content */
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Beautiful Empty State */
          <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 rounded-3xl bg-pink-50/10 border border-dashed border-pink-100/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-400 mb-4 animate-bounce">
              <SlidersHorizontal className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-700 mb-1">
              {lang === 'ar' ? 'لم نجد أي منتجات تطابق بحثك' : 'No Products Match'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-4">
              {dict.emptyState}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="rounded-full bg-pink-100 px-5 py-2 text-xs font-semibold text-pink-600 hover:bg-pink-200 transition-colors"
            >
              {lang === 'ar' ? 'عرض الكل' : 'Clear Filters'}
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
