import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../products/product';
import { CartService } from './cart-service';

describe('CartService', () => {
  let service: CartService;
  const product: Product = {
    id: 1,
    name: 'Incenso',
    description: 'Incenso natural',
    price: 12.5,
    originalPrice: 15,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds products and combines quantities for the same product', () => {
    service.addToCart(product);
    service.addToCart(product);

    expect(service.items()).toEqual([{ product, quantity: 2 }]);
    expect(service.totalItems()).toBe(2);
    expect(service.totalPrice()).toBe(25);
    expect(service.totalSavings()).toBe(5);
  });

  it('does not count products without a valid discount in total savings', () => {
    const productWithoutOriginalPrice: Product = {
      id: 2,
      name: 'Vela',
      description: 'Vela aromática',
      price: 20,
    };
    const productWithHigherOriginalPrice: Product = {
      ...product,
      id: 3,
      price: 20,
    };

    service.addToCart(product);
    service.addToCart(productWithoutOriginalPrice);
    service.addToCart(productWithHigherOriginalPrice);

    expect(service.totalSavings()).toBe(2.5);
  });

  it('increases and decreases an item quantity, removing it at one', () => {
    service.addToCart(product);
    service.increaseQuantity(product.id);

    expect(service.items()[0].quantity).toBe(2);
    expect(service.totalSavings()).toBe(5);

    service.decreaseQuantity(product.id);
    expect(service.items()[0].quantity).toBe(1);
    expect(service.totalSavings()).toBe(2.5);

    service.decreaseQuantity(product.id);
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.totalSavings()).toBe(0);
  });

  it('removes an item and clears the remaining cart', () => {
    const secondProduct = { ...product, id: 2, name: 'Vela' };
    service.addToCart(product);
    service.addToCart(secondProduct);
    service.removeFromCart(product.id);

    expect(service.items()).toEqual([{ product: secondProduct, quantity: 1 }]);
    expect(service.totalPrice()).toBe(secondProduct.price);

    service.clear();
    expect(service.items()).toEqual([]);
    expect(service.totalPrice()).toBe(0);
  });
});
