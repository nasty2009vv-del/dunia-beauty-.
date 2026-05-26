'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/db';
import { Search, Sparkles, SlidersHorizontal, Truck, MessageCircle, BadgeCheck, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Hero Slider Data ───────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    badge:    { ar: '✨ عطور فاخرة', en: '✨ Luxury Perfumes' },
    title:    { ar: 'دنيا بيوتي', en: 'Dunia Beauty' },
    subtitle: { ar: 'اكتشفي أرقى العطور الفواحة المختارة بعناية لتعكس أناقتك وجمالك الفريد.', en: 'Discover captivating perfumes carefully chosen to reflect your unique elegance.' },
    cta:      { ar: 'تسوق العطور', en: 'Shop Perfumes' },
    href: '#products',
    bg: 'from-pink-100 via-rose-50 to-fuchsia-100',
    blob1: 'bg-pink-300/25',
    blob2: 'bg-fuchsia-300/20',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Luxury Perfume',
  },
  {
    id: 2,
    badge:    { ar: '💄 مكياج فاخر', en: '💄 Luxury Makeup' },
    title:    { ar: 'مكياج يليق بكِ', en: 'Makeup You Deserve' },
    subtitle: { ar: 'تشكيلة مختارة بعناية من أرقى أصناف المكياج لتضيفي لمسة جمال لا تُنسى كل يوم.', en: 'A carefully curated selection of premium makeup to add an unforgettable touch every day.' },
    cta:      { ar: 'اكتشفي المكياج', en: 'Explore Makeup' },
    href: '#products',
    bg: 'from-rose-100 via-pink-50 to-red-100',
    blob1: 'bg-rose-300/25',
    blob2: 'bg-pink-300/20',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Luxury Makeup Palette',
  },
  {
    id: 3,
    badge:    { ar: '🌙 راحة فائقة', en: '🌙 Ultimate Comfort' },
    title:    { ar: 'نوم هانئ وأنيق', en: 'Sleep in Style' },
    subtitle: { ar: 'بيجامات حريرية فاخرة بأفخم الخامات وأجمل التصاميم، للتمتع بليلة هادئة وناعمة.', en: 'Luxurious silk pajamas crafted from the finest fabrics for a peaceful, stylish night.' },
    cta:      { ar: 'تسوق البيجامات', en: 'Shop Pajamas' },
    href: '#products',
    bg: 'from-purple-100 via-pink-50 to-rose-100',
    blob1: 'bg-purple-300/20',
    blob2: 'bg-pink-300/20',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Silk Pajamas',
  },
];

// ─── Store Features ──────────────────────────────────────────────────────────────
const STORE_FEATURES = [
  { icon: Truck,         ar: 'توصيل سريع',      en: 'Fast Delivery',      descAr: 'لجميع المناطق',                 descEn: 'Nationwide shipping',            color: 'bg-pink-50 text-pink-500' },
  { icon: MessageCircle, ar: 'طلب عبر واتساب',  en: 'Order via WhatsApp', descAr: 'بضغطة زر واحدة فقط',           descEn: 'One-tap ordering',               color: 'bg-emerald-50 text-emerald-500' },
  { icon: BadgeCheck,    ar: 'جودة مضمونة 100%', en: '100% Authentic',    descAr: 'منتجات أصلية معتمدة',          descEn: 'Certified original products',    color: 'bg-purple-50 text-purple-500' },
];

// ─── Testimonials ────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { nameAr: 'سارة م.', nameEn: 'Sara M.', stars: 5, textAr: 'العطور ثباتها يجنن وريحتها فواحة جداً، والتعامل سريع ولطيف! اعتمدت المتجر خلاص 💕', textEn: 'The perfumes last so long and smell amazing! Service is quick and friendly. My go-to store 💕' },
  { nameAr: 'ريم ع.', nameEn: 'Reem A.', stars: 5, textAr: 'البيجامة الحرير خامتها خيالية وباردة على الجلد، وصلت بسرعة وتغليفها أنيق جداً 🌸', textEn: 'The silk pajama feels heavenly on skin, arrived quickly with elegant packaging 🌸' },
  { nameAr: 'نور خ.', nameEn: 'Nour K.', stars: 5, textAr: 'أحمر الشفاه مثبّت طول اليوم ولونه جميل جداً، سعيدة جداً بالشراء وراح أكرر! ⭐', textEn: 'The lipstick lasts all day with beautiful color. Totally happy and will order again! ⭐' },
  { nameAr: 'لمى س.', nameEn: 'Lama S.', stars: 5, textAr: 'موقع راقي وخدمة ممتازة، وصلت الطلبية بحالة ممتازة وأسرع من التوقع. بنصح فيه 🎀', textEn: 'Premium site, excellent service! Order arrived in perfect condition and faster than expected 🎀' },
];

export default function HomePage() {
  const { dict, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'perfumes' | 'makeup' | 'pajamas'>('all');

  // Hero Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-pink');
    } else {
      document.documentElement.classList.remove('dark-pink');
    }
  }, [darkMode]);

  const goToSlide = (idx: number) => {
    if (isSliding) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsSliding(false);
    }, 200);
  };

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

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className={`space-y-8 sm:space-y-12 animate-fade-in ${darkMode ? 'dark-pink-mode' : ''}`}>

      {/* ── Announcement Bar ─────────────────────────────────────────────────── */}
      <div className="relative -mx-4 -mt-6 sm:-mx-6 lg:-mx-8 overflow-hidden bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 py-2 px-4">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-bold text-white">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8">
              <span>✨ {lang === 'ar' ? 'شحن مجاني للطلبات فوق 300 ريال' : 'Free shipping on orders over 300 SAR'}</span>
              <span>🎁 {lang === 'ar' ? 'هدية مجانية مع كل طلب واتساب' : 'Free gift with every WhatsApp order'}</span>
              <span>💖 {lang === 'ar' ? 'منتجات أصلية 100% مضمونة' : '100% Authentic products guaranteed'}</span>
              <span>🌸 {lang === 'ar' ? 'تشكيلة جديدة أسبوعياً' : 'New arrivals every week'}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero Slider ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl shadow-md border border-pink-100/50">
        
        {/* Slide Background */}
        <div className={`relative bg-gradient-to-br ${slide.bg} p-6 sm:p-10 md:p-14 transition-opacity duration-300 ${isSliding ? 'opacity-0' : 'opacity-100'}`}>
          {/* Decorative blobs */}
          <div className={`absolute -right-10 -top-10 h-48 w-48 rounded-full ${slide.blob1} blur-3xl`} />
          <div className={`absolute -left-10 -bottom-10 h-48 w-48 rounded-full ${slide.blob2} blur-3xl`} />

          {/* Two-column layout: text + image */}
          <div className="relative flex items-center justify-between gap-4">

            {/* Text Content */}
            <div className="space-y-3 sm:space-y-5 flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-pink-600 backdrop-blur-sm shadow-sm">
                {lang === 'ar' ? slide.badge.ar : slide.badge.en}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-800 leading-tight">
                {lang === 'ar' ? slide.title.ar : slide.title.en}
              </h1>

              <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-600 leading-relaxed max-w-sm">
                {lang === 'ar' ? slide.subtitle.ar : slide.subtitle.en}
              </p>

              <div className="pt-1">
                <a
                  href={slide.href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:from-pink-600 hover:to-rose-500 hover:shadow-md transition-all duration-300 transform active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === 'ar' ? slide.cta.ar : slide.cta.en}</span>
                </a>
              </div>
            </div>

            {/* Floating Product Image */}
            <div className="hidden sm:flex shrink-0 items-center justify-center relative">
              {/* Glow ring */}
              <div className="absolute h-52 w-52 md:h-64 md:w-64 rounded-full bg-white/40 blur-2xl" />
              {/* Decorative circles */}
              <div className="absolute h-44 w-44 md:h-56 md:w-56 rounded-full border-2 border-white/30 animate-spin-slow" />
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.imageAlt}
                className="relative z-10 h-44 w-44 md:h-60 md:w-60 rounded-3xl object-cover shadow-2xl border-4 border-white/70 animate-float"
                style={{ animationDelay: '0s' }}
              />
              {/* Small decorative badge */}
              <div className="absolute -bottom-2 -start-2 z-20 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg px-3 py-1.5 border border-pink-100 text-xs font-bold text-pink-600 animate-bounce-slow">
                ✨ {lang === 'ar' ? 'جودة فاخرة' : 'Premium Quality'}
              </div>
            </div>

          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-pink-500 w-5 h-2' : 'bg-pink-300/60 w-2 h-2 hover:bg-pink-400'}`}
            />
          ))}
        </div>

        {/* Prev/Next Arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute top-1/2 start-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-pink-500 backdrop-blur-sm shadow hover:bg-white hover:shadow-md transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)}
          className="absolute top-1/2 end-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-pink-500 backdrop-blur-sm shadow hover:bg-white hover:shadow-md transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </section>

      {/* ── Store Features Bar ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STORE_FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.en} className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white px-4 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${feat.color} shadow-inner`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-neutral-800">{lang === 'ar' ? feat.ar : feat.en}</p>
                <p className="text-xs text-neutral-500 font-medium">{lang === 'ar' ? feat.descAr : feat.descEn}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Filter & Products ────────────────────────────────────────────────── */}
      <section id="products" className="space-y-4 pt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Categories Tabs */}
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 rounded-3xl bg-pink-50/10 border border-dashed border-pink-100/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-400 mb-4 animate-bounce">
              <SlidersHorizontal className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-700 mb-1">
              {lang === 'ar' ? 'لم نجد أي منتجات تطابق بحثك' : 'No Products Match'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-4">{dict.emptyState}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="rounded-full bg-pink-100 px-5 py-2 text-xs font-semibold text-pink-600 hover:bg-pink-200 transition-colors"
            >
              {lang === 'ar' ? 'عرض الكل' : 'Clear Filters'}
            </button>
          </div>
        )}
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-800">
            {lang === 'ar' ? '💬 آراء زبائننا' : '💬 Customer Reviews'}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            {lang === 'ar' ? 'تجارب حقيقية من عملاء دنيا بيوتي' : 'Real experiences from Dunia Beauty customers'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-3">
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.stars)].map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {/* Text */}
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                "{lang === 'ar' ? t.textAr : t.textEn}"
              </p>
              {/* Name Badge */}
              <div className="flex items-center gap-2 pt-1 border-t border-pink-50">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white text-[10px] font-black shrink-0">
                  {(lang === 'ar' ? t.nameAr : t.nameEn).charAt(0)}
                </div>
                <span className="text-xs font-bold text-neutral-700">{lang === 'ar' ? t.nameAr : t.nameEn}</span>
                <span className="ms-auto text-[10px] font-bold text-emerald-500">✓ {lang === 'ar' ? 'مشترٍ موثق' : 'Verified buyer'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark Mode Toggle (FAB) ────────────────────────────────────────────── */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        title={lang === 'ar' ? 'تبديل الوضع الليلي' : 'Toggle dark mode'}
        className={`fixed bottom-20 end-4 md:bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 border text-sm ${
          darkMode
            ? 'bg-fuchsia-900 border-fuchsia-700 text-fuchsia-200 hover:bg-fuchsia-800'
            : 'bg-white border-pink-100 text-pink-500 hover:bg-pink-50'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

    </div>
  );
}
