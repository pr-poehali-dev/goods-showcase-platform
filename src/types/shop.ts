export type Page = "home" | "catalog" | "cart" | "contacts";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: "hot" | "new" | string | null;
  category: string;
  emoji?: string;
  image_url?: string | null;
  image?: string;
  old_price?: number | null;
  is_active?: boolean;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export const CATEGORIES = ["Все", "Электроника", "Аксессуары", "Дом", "Обувь", "Другое"];
export const API = "https://functions.poehali.dev/4b307dc4-c917-4396-a915-36d6e40b4d2e";
export const HERO_IMG = "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/b66a8b4c-dc69-41cc-b407-f306235b660a.jpg";
