import { computed, Injectable, signal } from '@angular/core';
import { Product } from './product';
import { CardItem } from '../../shared/models/card.item';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private readonly cartItems = signal<CardItem[]>([]);

  readonly totaItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  addToCart(product: Product) {
    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }
}
