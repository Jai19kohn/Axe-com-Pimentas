import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../products/product';
import { CartService } from '../cart/cart-service';

import { Checkout } from './checkout';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
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
      imports: [Checkout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a return link when the cart is empty', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Seu carrinho está vazio.');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });

  it('marks invalid fields and does not place an order', () => {
    cartService.addToCart(product);
    fixture.detectChanges();

    component.submitOrder();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Informe seu nome.');
    expect(cartService.items()).toHaveLength(1);
  });

  it('offers all Brazilian states and normalizes the email input', () => {
    cartService.addToCart(product);
    fixture.detectChanges();

    const stateOptions = fixture.nativeElement.querySelectorAll('#state option');
    const emailInput = fixture.nativeElement.querySelector('#email') as HTMLInputElement;
    emailInput.value = ' Maria@Example.COM ';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(stateOptions).toHaveLength(28);
    expect(fixture.nativeElement.querySelector('#state option[value="SP"]')).not.toBeNull();
    expect(emailInput.value).toBe('maria@example.com');
    expect(component.checkoutForm.controls.email.value).toBe('maria@example.com');
  });

  it('applies Brazilian masks to phone and postal code', () => {
    cartService.addToCart(product);
    fixture.detectChanges();

    const phoneInput = fixture.nativeElement.querySelector('#phone') as HTMLInputElement;
    const postalCodeInput = fixture.nativeElement.querySelector('#postal-code') as HTMLInputElement;

    expect(phoneInput.getAttribute('mask')).toBe('(00) 0000-0000||(00) 00000-0000');
    expect(postalCodeInput.getAttribute('mask')).toBe('00000-000');

    phoneInput.value = '11999999999';
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    postalCodeInput.value = '01001000';
    postalCodeInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(phoneInput.value).toBe('(11) 99999-9999');
    expect(postalCodeInput.value).toBe('01001-000');
    expect(component.checkoutForm.controls.phone.value).toBe('(11) 99999-9999');
    expect(component.checkoutForm.controls.postalCode.value).toBe('01001-000');
  });

  it('confirms a valid order and clears the cart', () => {
    cartService.addToCart(product);
    component.checkoutForm.setValue({
      fullName: 'Maria da Silva',
      email: 'maria@example.com',
      phone: '(11) 99999-9999',
      postalCode: '01001-000',
      street: 'Rua das Flores',
      addressNumber: '100',
      city: 'São Paulo',
      state: 'SP',
      paymentMethod: 'pix',
    });
    fixture.detectChanges();

    component.submitOrder();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Seu pedido demonstrativo foi recebido.');
    expect(fixture.nativeElement.textContent).toContain('Maria da Silva');
    expect(fixture.nativeElement.textContent).toContain(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(12.5),
    );
    expect(cartService.items()).toEqual([]);
  });
});
