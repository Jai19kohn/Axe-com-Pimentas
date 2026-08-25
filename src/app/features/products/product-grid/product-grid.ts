import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard, MatIcon],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  readonly products = input.required<Product[]>();
  readonly emptyMessage = input('Nenhum produto corresponde à sua pesquisa.');

  readonly addToCart = output<Product>();

  protected onAddToCart(product: Product) {
    this.addToCart.emit(product);
  }
}
