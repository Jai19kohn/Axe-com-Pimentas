import type { ProductCategoryId } from './category';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId?: ProductCategoryId;
}
