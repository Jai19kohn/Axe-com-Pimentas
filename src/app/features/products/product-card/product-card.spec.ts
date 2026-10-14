import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../product';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;
  const product: Product = {
    id: 1,
    name: 'Incenso',
    description: 'Incenso natural',
    price: 12.5,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the product details page', () => {
    fixture.detectChanges();
    const detailsLink = fixture.nativeElement.querySelector(
      'mat-card-actions a',
    ) as HTMLAnchorElement | null;

    expect(detailsLink?.getAttribute('href')).toBe('/products/1');
  });

  it('emits the product when add to cart is clicked', () => {
    let addedProduct: Product | undefined;
    component.addToCart.subscribe((selectedProduct) => {
      addedProduct = selectedProduct;
    });
    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;
    addButton?.click();

    expect(addedProduct).toEqual(product);
  });
});
