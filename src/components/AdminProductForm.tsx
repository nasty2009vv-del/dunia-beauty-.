'use client';

import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { addProduct, Product } from '@/lib/db';
import { Plus, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AdminProductFormProps {
  onProductAdded: (product: Product) => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ onProductAdded }) => {
  const { dict, lang } = useLanguage();
  
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<'perfumes' | 'makeup' | 'pajamas'>('makeup');
  const [imageUrl, setImageUrl] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Convert uploaded file to base64 string
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setIsUploading(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: lang === 'ar' ? 'فشل قراءة الملف.' : 'Failed to read file.' });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate inputs
    const parsedPrice = parseFloat(price);
    const parsedQty = parseInt(quantity, 10);

    if (!name.trim() || !nameAr.trim() || isNaN(parsedPrice) || isNaN(parsedQty) || !description.trim() || !descriptionAr.trim() || !imageUrl) {
      setMessage({ type: 'error', text: dict.invalidForm });
      return;
    }

    setIsSubmitting(true);

    try {
      const newProduct = await addProduct({
        name: name.trim(),
        nameAr: nameAr.trim(),
        price: parsedPrice,
        description: description.trim(),
        descriptionAr: descriptionAr.trim(),
        quantity: parsedQty,
        category,
        imageUrl,
      });

      onProductAdded(newProduct);
      setMessage({ type: 'success', text: dict.successAdd });
      
      // Reset form fields
      setName('');
      setNameAr('');
      setPrice('');
      setDescription('');
      setDescriptionAr('');
      setQuantity('');
      setImageUrl('');
      setImageFile(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: dict.errorAdd });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-pink-100 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-pink-50 pb-4 mb-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
          <Plus className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-bold text-neutral-800">{dict.addProduct}</h3>
      </div>

      {message && (
        <div className={`mb-5 flex items-start gap-2 rounded-xl p-3.5 text-xs sm:text-sm border ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          )}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Names Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
              placeholder="e.g. Royal Rose Perfume"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productNameAr} *
            </label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
              placeholder="مثال: عطر الورد الملكي"
              dir="rtl"
            />
          </div>
        </div>

        {/* Price & Quantity & Category Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productPrice} *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
              placeholder="e.g. 45.00"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productQty} *
            </label>
            <input
              type="number"
              required
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
              placeholder="e.g. 10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productCategory} *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
            >
              <option value="perfumes">{dict.perfumes}</option>
              <option value="makeup">{dict.makeup}</option>
              <option value="pajamas">{dict.pajamas}</option>
            </select>
          </div>
        </div>

        {/* Descriptions Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productDesc} *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200 resize-none"
              placeholder="Describe the product scent or texture..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              {dict.productDescAr} *
            </label>
            <textarea
              required
              rows={3}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200 resize-none"
              placeholder="صف رائحة أو ملمس المنتج بالعربية..."
              dir="rtl"
            />
          </div>
        </div>

        {/* Image Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
            {dict.imageUrl} *
          </label>
          <div className="flex flex-col gap-3 sm:flex-row items-stretch">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 rounded-xl border border-pink-100 bg-pink-50/10 px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-200"
              placeholder="https://example.com/image.jpg"
            />
            <div className="relative shrink-0 flex items-center">
              <label className="w-full flex items-center justify-center gap-1.5 cursor-pointer rounded-xl border border-dashed border-pink-300 bg-pink-50/30 hover:bg-pink-50 py-2 px-4 text-xs font-bold text-pink-600 transition-colors">
                <ImageIcon className="h-4 w-4" />
                <span>{dict.imageUpload}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {/* Image Preview Box */}
          {imageUrl && (
            <div className="relative mt-2 h-36 w-36 overflow-hidden rounded-xl border border-pink-100 bg-pink-50/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  setImageFile(null);
                }}
                className="absolute top-1.5 right-1.5 rounded-full bg-black/50 p-1 text-white hover:bg-black/75 transition-colors"
              >
                &times;
              </button>
            </div>
          )}
          {isUploading && (
            <div className="flex items-center gap-1.5 text-xs text-pink-500 py-1 font-medium">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{dict.uploading}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-pink-600 hover:to-rose-500 hover:shadow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{dict.submitting}</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>{dict.submit}</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
