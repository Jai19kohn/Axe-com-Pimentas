import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CartService } from '../cart/cart-service';

type PaymentMethod = 'pix' | 'card';

interface OrderConfirmation {
  reference: string;
  customerName: string;
  itemCount: number;
  totalPrice: number;
  totalSavings: number;
  paymentMethod: string;
}

@Component({
  selector: 'app-checkout',
  imports: [NgxMaskDirective, ReactiveFormsModule, RouterLink],
  providers: [provideNgxMask()],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly cartService = inject(CartService);
  protected readonly confirmation = signal<OrderConfirmation | null>(null);
  protected readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  protected readonly states = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' },
  ];

  readonly checkoutForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
    street: ['', Validators.required],
    addressNumber: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    paymentMethod: new FormControl<PaymentMethod>('pix', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  normalizeEmail(event: Event): void {
    const input = event.target as HTMLInputElement;
    const normalizedEmail = input.value.replace(/\s/g, '').toLowerCase();

    input.value = normalizedEmail;
    this.checkoutForm.controls.email.setValue(normalizedEmail);
  }

  submitOrder(): void {
    if (this.cartService.items().length === 0) return;

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const { fullName, paymentMethod } = this.checkoutForm.getRawValue();

    this.confirmation.set({
      reference: `AXE-${Date.now().toString(36).toUpperCase()}`,
      customerName: fullName.trim(),
      itemCount: this.cartService.totalItems(),
      totalPrice: this.cartService.totalPrice(),
      totalSavings: this.cartService.totalSavings(),
      paymentMethod: paymentMethod === 'pix' ? 'Pix' : 'Cartão',
    });

    this.cartService.clear();
  }
}
