export type ProductCategory = 'homme' | 'femme' | 'accessoires';

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: ProductCategory;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  inStock: boolean;
  isNew: boolean;
  rating: number;
  details?: string[];
  care?: string[];
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
  description?: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName?: string;
}

export type Language = 'fr' | 'ar';

export interface FilterState {
  category: string;
  size: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  sort: 'newest' | 'price-asc' | 'price-desc';
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}
