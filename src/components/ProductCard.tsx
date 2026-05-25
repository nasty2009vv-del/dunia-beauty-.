'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Product } from '@/lib/db';
import { MessageCircle, ShoppingBag, Eye, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  adminMode?: boolean;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, adminMode = false, onDelete }) => {
  const { dict, lang } = useLanguage();
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  // Use the appropriate translated fields
  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const displayDesc = lang === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
  const isOutOfStock = product.quantity <= 0;

  // Retrieve store WhatsApp number from localStorage or use a default
  let shopPhone = '966500000000'; // Default Saudi phone number
  if (typeof window !== 'undefined') {
    const customPhone = localStorage.getItem('dunia_beauty_whatsapp_phone');
    if (customPhone) {
      shopPhone = customPhone.replace('+', '').replace(/\s+/g, '');
    }
  }

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal trigger
    
    // Construct the WhatsApp message
    let msg = dict.whatsAppMsg
      .replace('{name}', displayName)
      .replace('{price}', `${product.price} ${lang === 'ar' ? 'ر.س' : 'SAR'}`)
      .replace('{category}', dict[product.category] || product.category);

    const waLink = `https://wa.me/${shopPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'perfumes': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'makeup': return 'bg-pink-50 text-pink-600 border-pink-100';
      case 'pajamas': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowDetailModal(true)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-pink-50/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={displayName}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category Tag */}
          <span className={`absolute top-2.5 right-2.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${getCategoryColor(product.category)}`}>
            {dict[product.category] || product.category}
          </span>

          {/* Out of Stock Label */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <span className="rounded-full bg-rose-600 px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                {dict.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-bold text-sm sm:text-base text-neutral-800 line-clamp-1 group-hover:text-pink-600 transition-colors">
              {displayName}
            </h3>
            <span className="font-extrabold text-sm sm:text-base text-pink-600 shrink-0">
              {product.price} {lang === 'ar' ? 'ر.س' : 'SAR'}
            </span>
          </div>

          <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed flex-1">
            {displayDesc}
          </p>

          <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 mb-3 border-t border-dashed border-pink-50 pt-2.5">
            <span>
              {dict.quantity}: <span className={isOutOfStock ? 'text-rose-500' : 'text-emerald-500 font-semibold'}>{product.quantity}</span>
            </span>
            <span className="flex items-center gap-0.5 text-pink-400 group-hover:translate-x-0.5 transition-transform duration-200">
              <Eye className="h-3 w-3" />
              <span>{lang === 'ar' ? 'تفاصيل' : 'Details'}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-2">
            {!adminMode ? (
              <button
                onClick={handleWhatsAppOrder}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:shadow hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 disabled:from-neutral-200 disabled:to-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{dict.orderWhatsApp}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete(product.id);
                  }}
                  className="flex-1 rounded-xl bg-rose-50 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  {dict.delete}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-up max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="absolute top-3 right-3 z-10">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-full bg-white/80 text-neutral-500 hover:text-neutral-800 backdrop-blur-md shadow-sm border border-neutral-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="overflow-y-auto flex-1">
              <div className="relative aspect-video w-full bg-pink-50/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl || '/placeholder.png'}
                  alt={displayName}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide mb-2 ${getCategoryColor(product.category)}`}>
                    {dict[product.category] || product.category}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-neutral-800 leading-tight">
                      {displayName}
                    </h2>
                    <span className="text-lg sm:text-xl font-black text-pink-600 whitespace-nowrap">
                      {product.price} {lang === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-pink-50 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {dict.description}
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                    {displayDesc}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-500 border-t border-pink-50 pt-4">
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-700">{dict.quantity}:</span>
                    <span className={`font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {product.quantity} {isOutOfStock ? `(${dict.outOfStock})` : `(${dict.available})`}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Action */}
            <div className="border-t border-pink-50 p-4 bg-pink-50/20 flex gap-2">
              <button
                onClick={handleWhatsAppOrder}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 px-4 text-sm font-semibold text-white shadow hover:shadow-md hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 disabled:from-neutral-200 disabled:to-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed transform active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{dict.orderWhatsApp}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
