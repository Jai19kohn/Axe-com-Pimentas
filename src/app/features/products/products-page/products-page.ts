import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../product-service';
import { Product } from '../product';
import { Cart } from '../../cart/cart';
import { ProductGrid } from '../product-grid/product-grid';
import { ProductSearch } from '../product-search/product-search';

@Component({
  selector: 'app-products-page',
  imports: [ProductGrid, ProductSearch],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly cart = inject(Cart);
  private readonly productService = inject(ProductService);

  protected readonly searchTerm = signal('');

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLocaleLowerCase().trim();
    const products = this.productService.products();

    if (!term) return products;

    return products.filter(
      (product) =>
        product.name.toLocaleLowerCase().includes(term) ||
        product.description.toLocaleLowerCase().includes(term),
    );
  });

  protected onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  protected onAddToCart(product: Product) {
    this.cart.addToCart(product);
  }
}
