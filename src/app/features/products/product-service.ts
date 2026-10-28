import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { environment } from '../../../environments/environment';
import type { Product, ProductCreateRequest } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal(true);
  private readonly errorSignal = signal<string | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly auth: Auth,
  ) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Product[]>(`${environment.apiUrl}/products`).subscribe({
      next: (products) => {
        this.productsSignal.set(products);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set(
          'Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.',
        );
        this.loadingSignal.set(false);
      },
    });
  }

  create(product: ProductCreateRequest): Observable<Product> {
    return this.http
      .post<Product>(`${environment.apiUrl}/products`, product, {
        headers: this.auth.authorizationHeaders(),
      })
      .pipe(
        tap((createdProduct) =>
          this.productsSignal.update((products) => [...products, createdProduct]),
        ),
      );
  }

  /** Usado pela tela de detalhes do produto (product-details). */
  getById(id: number): Product | undefined {
    return this.productsSignal().find((product) => product.id === id);
  }
}
