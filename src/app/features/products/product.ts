import type { ProductCategoryId } from './category';

export type ProductFulfillmentMode = 'READY_TO_SHIP' | 'MADE_TO_ORDER' | 'CUSTOM';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  categoryId?: ProductCategoryId;
  fulfillmentMode?: ProductFulfillmentMode;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  categoryId: ProductCategoryId;
  fulfillmentMode: ProductFulfillmentMode;
}
