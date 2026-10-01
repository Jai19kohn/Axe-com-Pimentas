import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../features/products/product';
import { CartItem } from './cart.item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItemsSignal = signal<CartItem[]>([]);

  readonly items = this.cartItemsSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  readonly totalSavings = computed(() =>
    this.items().reduce((total, item) => total + this.itemSavings(item), 0),
  );

  itemSavings(item: CartItem): number {
    const originalPrice = item.product.originalPrice ?? item.product.price;
    return Math.max(originalPrice - item.product.price, 0) * item.quantity;
  }

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

  increaseQuantity(productId: number) {
    this.cartItemsSignal.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  decreaseQuantity(productId: number) {
    this.cartItemsSignal.update((items) => {
      const item = items.find((cartItem) => cartItem.product.id === productId);

      if (!item) return items;
      if (item.quantity <= 1) {
        return items.filter((cartItem) => cartItem.product.id !== productId);
      }

      return items.map((cartItem) =>
        cartItem.product.id === productId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      );
    });
  }

  removeFromCart(productId: number) {
    this.cartItemsSignal.update((items) => items.filter((item) => item.product.id !== productId));
  }

  clear() {
    this.cartItemsSignal.set([]);
  }
}
