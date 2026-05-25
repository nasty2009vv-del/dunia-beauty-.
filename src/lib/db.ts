import { supabase, isSupabaseAvailable } from './supabase';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  description: string;
  descriptionAr: string;
  quantity: number;
  category: 'perfumes' | 'makeup' | 'pajamas';
  imageUrl: string;
  createdAt?: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'default-1',
    name: 'Royal Rose Eau de Parfum',
    nameAr: 'عطر الورد الملكي الفاخر',
    price: 75,
    description: 'A luxurious perfume infused with organic rose petals, vanilla, and sweet warm amber.',
    descriptionAr: 'عطر فاخر غني ببتلات الورد العضوي الطبيعي، الفانيليا والعنبر الدافئ الأنيق.',
    quantity: 12,
    category: 'perfumes',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60',
    createdAt: Date.now() - 60000 * 5,
  },
  {
    id: 'default-2',
    name: 'Soft Lavender Mist',
    nameAr: 'رذاذ اللافندر الناعم المنعش',
    price: 48,
    description: 'Calming lavender scent blended with fresh citrus notes. Perfect for daily refreshing wear.',
    descriptionAr: 'رائحة اللافندر المهدئة الممزوجة بنوتات الحمضيات المنعشة. مثالي للاستخدام اليومي المريح.',
    quantity: 8,
    category: 'perfumes',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60',
    createdAt: Date.now() - 60000 * 4,
  },
  {
    id: 'default-3',
    name: 'Velvet Matte Lipstick (Pink Blush)',
    nameAr: 'أحمر شفاه مخملي مطفي (وردي خجول)',
    price: 22,
    description: 'Long-lasting, moisturizing matte lipstick with a velvet finish and a cute soft pink shade.',
    descriptionAr: 'أحمر شفاه مطفي يدوم طويلاً، مرطب بلمسة مخملية ودرجة لون وردية لطيفة وناعمة.',
    quantity: 25,
    category: 'makeup',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60',
    createdAt: Date.now() - 60000 * 3,
  },
  {
    id: 'default-4',
    name: 'Glow & Shine Highlighter Palette',
    nameAr: 'لوحة إضاءة التوهج واللمعان المشرقة',
    price: 35,
    description: 'Four luminous shades that blend seamlessly to create a warm, radiant and cute complexion.',
    descriptionAr: 'أربع درجات مضيئة ساحرة تمتزج بسلاسة لخلق بشرة دافئة ومشرقة وجذابة للغاية.',
    quantity: 15,
    category: 'makeup',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60',
    createdAt: Date.now() - 60000 * 2,
  },
  {
    id: 'default-5',
    name: 'Silk Satin Pajama Set (Pastel Pink)',
    nameAr: 'طقم بيجامة ساتان حريري (وردي باستيل)',
    price: 55,
    description: 'Ultra-soft silk satin 2-piece button-up pajama set with white piping. Relax in absolute comfort.',
    descriptionAr: 'طقم بيجامة ناعم ومريح للغاية من الساتان الحريري الفخم، قطعتين بأزرار وتفاصيل أنيقة.',
    quantity: 10,
    category: 'pajamas',
    imageUrl: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=500&auto=format&fit=crop&q=60',
    createdAt: Date.now() - 60000 * 1,
  },
  {
    id: 'default-6',
    name: 'Fluffy Cloud Nightwear Set',
    nameAr: 'ملابس نوم سحاب الغيم الناعمة والمريحة',
    price: 65,
    description: 'Cozy, warm flannel pajama set with a cute cloud pattern. Perfect for cozy sweet nights.',
    descriptionAr: 'طقم بيجامة دافئ ومريح من الفلانيل الفخم بنمط سحاب لطيف. مثالي لليالي الشتاء الهادئة.',
    quantity: 6,
    category: 'pajamas',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&auto=format&fit=crop&q=60',
    createdAt: Date.now(),
  }
];

const LOCAL_STORAGE_KEY = 'dunia_beauty_products';

// Mapping helpers
const mapRowToProduct = (row: any): Product => ({
  id: String(row.id),
  name: row.name,
  nameAr: row.name_ar,
  price: Number(row.price),
  description: row.description,
  descriptionAr: row.description_ar,
  quantity: Number(row.quantity),
  category: row.category,
  imageUrl: row.image_url,
  createdAt: row.created_at ? new Date(row.created_at).getTime() : undefined,
});

const mapProductToRow = (product: Omit<Product, 'id'>) => ({
  name: product.name,
  name_ar: product.nameAr,
  price: product.price,
  description: product.description,
  description_ar: product.descriptionAr,
  quantity: product.quantity,
  category: product.category,
  image_url: product.imageUrl,
});

export const getProducts = async (): Promise<Product[]> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(mapRowToProduct);
      }
      
      // Seed default products to Supabase if the table is empty
      const rows = DEFAULT_PRODUCTS.map(({ id, ...rest }) => mapProductToRow(rest));
      const { data: seededData, error: seedError } = await supabase
        .from('products')
        .insert(rows)
        .select();

      if (seedError) throw seedError;
      if (seededData) return seededData.map(mapRowToProduct);
    } catch (error) {
      console.error("Error fetching from Supabase, switching to mock fallback:", error);
    }
  }

  // LocalStorage Fallback (Mock Mode)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored products", e);
      }
    }
    // Initialize with default products
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return DEFAULT_PRODUCTS;
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const row = mapProductToRow(productData);
      const { data, error } = await supabase
        .from('products')
        .insert([row])
        .select()
        .single();

      if (error) throw error;
      if (data) return mapRowToProduct(data);
    } catch (error) {
      console.error("Error adding to Supabase, switching to mock fallback:", error);
    }
  }

  // LocalStorage Fallback (Mock Mode)
  const products = await getProducts();
  const productWithId: Product = {
    id: `mock-${Date.now()}`,
    ...productData,
    createdAt: Date.now(),
  };
  const updatedProducts = [productWithId, ...products];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
  return productWithId;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  if (isSupabaseAvailable && supabase) {
    try {
      // Check if id is integer or uuid
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting from Supabase, switching to mock fallback:", error);
    }
  }

  // LocalStorage Fallback (Mock Mode)
  const products = await getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredProducts));
  return true;
};
