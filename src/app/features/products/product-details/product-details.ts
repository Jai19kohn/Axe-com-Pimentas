import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../cart/cart-service';
import { Product } from '../product';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly routeParameters = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly addedToCart = signal<number | null>(null);
  protected readonly product = computed(() => {
    const id = Number(this.routeParameters().get('id'));
    return Number.isInteger(id) && id > 0 ? this.productService.getById(id) : undefined;
  });
  protected readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  protected savingsFor(product: Product): number {
    return Math.max((product.originalPrice ?? product.price) - product.price, 0);
  }

  protected addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedToCart.set(product.id);
  }
}
