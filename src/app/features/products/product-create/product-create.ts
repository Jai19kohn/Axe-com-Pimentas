import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import type { ProductCreateRequest, ProductFulfillmentMode } from '../product';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss',
})
export class ProductCreate {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(120)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(2000)],
    }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    originalPrice: new FormControl<number | null>(null, [Validators.min(0.01)]),
    categoryId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)],
    }),
    fulfillmentMode: new FormControl<ProductFulfillmentMode | ''>('', Validators.required),
  });

  protected submit(): void {
    const formValue = this.productForm.getRawValue();
    if (
      this.productForm.invalid ||
      formValue.price === null ||
      formValue.fulfillmentMode === null ||
      formValue.fulfillmentMode === ''
    ) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product: ProductCreateRequest = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      price: formValue.price,
      originalPrice: formValue.originalPrice,
      categoryId: formValue.categoryId.trim(),
      fulfillmentMode: formValue.fulfillmentMode,
    };

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.productService.create(product).subscribe({
      next: (createdProduct) => {
        this.successMessage.set(`Produto "${createdProduct.name}" cadastrado com sucesso.`);
        this.productForm.reset({
          name: '',
          description: '',
          price: null,
          originalPrice: null,
          categoryId: '',
          fulfillmentMode: '',
        });
        this.isSaving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.auth.logout();
          void this.router.navigateByUrl('/admin/login');
          return;
        }
        this.errorMessage.set('Não foi possível cadastrar o produto. Tente novamente.');
        this.isSaving.set(false);
      },
    });
  }
}
