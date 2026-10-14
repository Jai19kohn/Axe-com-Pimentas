import { Injectable, signal } from '@angular/core';
import { Product } from './product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description:
      'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 199.99,
    originalPrice: 249.99,
    categoryId: 'audio',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description:
      'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 299.99,
    categoryId: 'wearables',
  },
  {
    id: 3,
    name: 'Portable Bluetooth Speaker',
    description: 'Compact speaker with powerful bass and 12-hour battery life.',
    price: 79.99,
    originalPrice: 99.99,
    categoryId: 'audio',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(MOCK_PRODUCTS);

  readonly products = this.productsSignal.asReadonly();

  /** Usado pela tela de detalhes do produto (product-details). */
  getById(id: number): Product | undefined {
    return this.productsSignal().find((product) => product.id === id);
  }
}
