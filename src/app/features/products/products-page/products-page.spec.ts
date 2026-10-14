import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { ProductsPage } from './products-page';

describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
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
