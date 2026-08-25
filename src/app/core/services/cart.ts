import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../features/products/product';
import { CartItem } from '../../shared/models/card.item';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private readonly cartItemsSignal = signal<CartItem[]>([]);

  readonly items = this.cartItemsSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  addToCart(product: Product) {
    this.cartItemsSignal.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItemsSignal.update((items) => items.filter((item) => item.product.id !== productId));
  }

  clear() {
    this.cartItemsSignal.set([]);
  }
}
