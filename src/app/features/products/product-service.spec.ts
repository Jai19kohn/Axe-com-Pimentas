import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  const products = [
    {
      id: 1,
      name: 'Molho de pimenta',
      description: 'Molho artesanal',
      price: 19.9,
      originalPrice: null,
      categoryId: 'molhos',
      fulfillmentMode: 'MADE_TO_ORDER',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductService);
    httpTestingController.expectOne('http://localhost:8080/api/products').flush(products);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads products from the backend and looks them up by id', () => {
    expect(service.products()).toEqual(products);
    expect(service.getById(1)?.name).toBe('Molho de pimenta');
  });

  it('creates a product and adds it to the current catalog', () => {
    const request = {
      name: 'Tempero artesanal',
      description: 'Tempero feito sob encomenda.',
      price: 25,
      originalPrice: null,
      categoryId: 'temperos',
      fulfillmentMode: 'MADE_TO_ORDER' as const,
    };
    const createdProduct = { id: 2, ...request };

    service.create(request).subscribe();
    httpTestingController.expectOne('http://localhost:8080/api/products').flush(createdProduct);

    expect(service.products()).toEqual([...products, createdProduct]);
  });

  it('exposes loading errors and supports retrying the request', () => {
    service.loadProducts();
    httpTestingController
      .expectOne('http://localhost:8080/api/products')
      .flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(service.loading()).toBe(false);
    expect(service.error()).toContain('Não foi possível carregar os produtos');

    service.loadProducts();
    expect(service.loading()).toBe(true);
    httpTestingController.expectOne('http://localhost:8080/api/products').flush(products);

    expect(service.error()).toBeNull();
    expect(service.products()).toEqual(products);
  });
});
