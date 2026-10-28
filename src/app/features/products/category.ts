import { Injectable } from '@angular/core';

export const PRODUCT_CATEGORIES = [
  { id: 'audio', label: 'Áudio' },
  { id: 'wearables', label: 'Vestíveis' },
] as const;

export type ProductCategoryId = string;

@Injectable({
  providedIn: 'root',
})
export class Category {
  readonly categories = PRODUCT_CATEGORIES;

  labelFor(id: ProductCategoryId): string {
    return PRODUCT_CATEGORIES.find((category) => category.id === id)?.label ?? id;
  }
}
