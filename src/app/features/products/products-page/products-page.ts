import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../product-service';
import { Product } from '../product';
import { Category, ProductCategoryId } from '../category';
import { CartService } from '../../cart/cart-service';
import { ProductGrid } from '../product-grid/product-grid';
import { ProductSearch } from '../product-search/product-search';

@Component({
  selector: 'app-products-page',
  imports: [ProductGrid, ProductSearch],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly cart = inject(CartService);
  protected readonly productService = inject(ProductService);
  private readonly categoryService = inject(Category);

  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal<ProductCategoryId | ''>('');
  protected readonly categories = computed(() => {
    const categoryIds = new Set(
      this.productService
        .products()
        .map((product) => product.categoryId)
        .filter((id): id is string => Boolean(id)),
    );
    return [...categoryIds].sort().map((id) => ({ id, label: this.categoryService.labelFor(id) }));
  });

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLocaleLowerCase().trim();
    const categoryId = this.selectedCategory();
    const products = this.productService.products();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLocaleLowerCase().includes(term) ||
        product.description.toLocaleLowerCase().includes(term);
      const matchesCategory = !categoryId || product.categoryId === categoryId;

      return matchesSearch && matchesCategory;
    });
  });

  protected onCategoryChange(event: Event) {
    this.selectedCategory.set((event.target as HTMLSelectElement).value as ProductCategoryId | '');
  }

  protected onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  protected onAddToCart(product: Product) {
    this.cart.addToCart(product);
  }

  protected loadProducts(): void {
    this.productService.loadProducts();
  }
}
