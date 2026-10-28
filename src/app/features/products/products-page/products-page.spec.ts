import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { ProductsPage } from './products-page';
import { environment } from '../../../../environments/environment';

describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;
  let httpTestingController: HttpTestingController;
  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 199.99,
      originalPrice: 249.99,
      categoryId: 'audio',
      fulfillmentMode: 'READY_TO_SHIP',
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with this advanced smartwatch.',
      price: 299.99,
      originalPrice: null,
      categoryId: 'wearables',
      fulfillmentMode: 'READY_TO_SHIP',
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      description: 'Compact speaker with powerful bass.',
      price: 79.99,
      originalPrice: 99.99,
      categoryId: 'audio',
      fulfillmentMode: 'READY_TO_SHIP',
    },
    {
      id: 4,
      name: 'Molho artesanal',
      description: 'Molho de pimenta artesanal.',
      price: 15,
      originalPrice: null,
      categoryId: 'molhos',
      fulfillmentMode: 'MADE_TO_ORDER',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    httpTestingController.expectOne(`${environment.apiUrl}/products`).flush(products);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters products by category', () => {
    fixture.detectChanges();
    const categorySelect = fixture.nativeElement.querySelector(
      '#category-filter',
    ) as HTMLSelectElement;

    categorySelect.value = 'audio';
    categorySelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const productCards = fixture.nativeElement.querySelectorAll('app-product-card');
    const pageText = fixture.nativeElement.textContent;

    expect(productCards).toHaveLength(2);
    expect(pageText).toContain('Premium Wireless Headphones');
    expect(pageText).toContain('Portable Bluetooth Speaker');
    expect(pageText).not.toContain('Smart Fitness Watch');
  });

  it('shows categories returned by the backend', () => {
    fixture.detectChanges();
    const categorySelect = fixture.nativeElement.querySelector(
      '#category-filter',
    ) as HTMLSelectElement;

    expect(Array.from(categorySelect.options).some((option) => option.value === 'molhos')).toBe(true);
  });

  it('combines category and text search and shows an empty result', () => {
    fixture.detectChanges();
    const categorySelect = fixture.nativeElement.querySelector(
      '#category-filter',
    ) as HTMLSelectElement;
    const searchInput = fixture.nativeElement.querySelector(
      '.search-field input',
    ) as HTMLInputElement;

    categorySelect.value = 'audio';
    categorySelect.dispatchEvent(new Event('change'));
    searchInput.value = 'speaker';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Portable Bluetooth Speaker');

    searchInput.value = 'fitness';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain(
      'Nenhum produto corresponde à sua pesquisa.',
    );
  });
});
