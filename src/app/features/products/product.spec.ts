import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { ProductService } from './product-service';

describe('Product catalog', () => {
  let productService: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    productService = TestBed.inject(ProductService);
    httpTestingController.expectOne(`${environment.apiUrl}/products`).flush([
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones.',
        price: 199.99,
        originalPrice: 249.99,
        categoryId: 'audio',
        fulfillmentMode: 'READY_TO_SHIP',
      },
    ]);
  });

  it('finds a product by id and returns undefined for an unknown id', () => {
    expect(productService.getById(1)?.name).toBe('Premium Wireless Headphones');
    expect(productService.getById(999)).toBeUndefined();
  });
});
