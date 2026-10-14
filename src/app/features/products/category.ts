import { Injectable } from '@angular/core';

export const PRODUCT_CATEGORIES = [
  { id: 'audio', label: 'Áudio' },
  { id: 'wearables', label: 'Vestíveis' },
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]['id'];

@Injectable({
  providedIn: 'root',
})
export class Category {
  readonly categories = PRODUCT_CATEGORIES;
}
