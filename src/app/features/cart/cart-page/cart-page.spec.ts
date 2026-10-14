import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../../products/product';
import { CartService } from '../cart-service';
import { CartPage } from './cart-page';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let cartService: CartService;
  const product: Product = {
    id: 1,
    name: 'Incenso',
    description: 'Incenso natural',
    price: 12.5,
    originalPrice: 15,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an empty state when there are no items', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Seu carrinho está vazio.');
  });

  it('updates quantities, subtotals, and total from the page controls', () => {
    cartService.addToCart(product);
    fixture.detectChanges();

    const increaseButton = fixture.nativeElement.querySelector(
      '[aria-label="Aumentar quantidade de Incenso"]',
    ) as HTMLButtonElement | null;
    expect(increaseButton).not.toBeNull();
    increaseButton?.click();
    fixture.detectChanges();

    expect(cartService.items()[0].quantity).toBe(2);
    expect(fixture.nativeElement.querySelector('.cart-total__value').textContent.trim()).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(25),
    );
    expect(fixture.nativeElement.querySelector('.cart-item__discount').textContent).toContain(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(5),
    );
    expect(fixture.nativeElement.querySelector('.cart-summary__savings').textContent).toContain(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(5),
    );

    const decreaseButton = fixture.nativeElement.querySelector(
      '[aria-label="Diminuir quantidade de Incenso"]',
    ) as HTMLButtonElement | null;
    decreaseButton?.click();
    decreaseButton?.click();
    fixture.detectChanges();

    expect(cartService.items()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Seu carrinho está vazio.');
  });

  it('removes a product from the cart', () => {
    cartService.addToCart(product);
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector(
      '[aria-label="Remover Incenso do carrinho"]',
    ) as HTMLButtonElement | null;
    expect(removeButton).not.toBeNull();
    removeButton?.click();
    fixture.detectChanges();

    expect(cartService.items()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Seu carrinho está vazio.');
  });
});
