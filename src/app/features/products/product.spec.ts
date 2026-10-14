import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProductService } from './product-service';

describe('Product catalog', () => {
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    productService = TestBed.inject(ProductService);
  });

  it('finds a product by id and returns undefined for an unknown id', () => {
    expect(productService.getById(1)?.name).toBe('Premium Wireless Headphones');
    expect(productService.getById(999)).toBeUndefined();
  });
});
