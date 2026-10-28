import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../../environments/environment';
import { ProductCreate } from './product-create';

describe('ProductCreate', () => {
  let fixture: ComponentFixture<ProductCreate>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreate],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductCreate);
    httpTestingController.expectOne(`${environment.apiUrl}/products`).flush([]);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('shows field validation and does not send an invalid product', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Informe o nome do produto');
    expect(httpTestingController.match(`${environment.apiUrl}/products`)).toHaveLength(0);
  });

  it('submits a valid product and confirms successful registration', () => {
    const component = fixture.componentInstance;
    component['productForm'].setValue({
      name: '  Molho artesanal  ',
      description: '  Molho de pimenta feito à mão.  ',
      price: 19.9,
      originalPrice: null,
      categoryId: '  molhos  ',
      fulfillmentMode: 'MADE_TO_ORDER',
    });

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const request = httpTestingController.expectOne(`${environment.apiUrl}/products`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Molho artesanal',
      description: 'Molho de pimenta feito à mão.',
      price: 19.9,
      originalPrice: null,
      categoryId: 'molhos',
      fulfillmentMode: 'MADE_TO_ORDER',
    });
    request.flush({
      id: 1,
      ...request.request.body,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Produto "Molho artesanal" cadastrado com sucesso.',
    );
    expect(component['productForm'].pristine).toBe(true);
  });

  it('shows an error when the backend rejects the product', () => {
    fixture.componentInstance['productForm'].setValue({
      name: 'Molho artesanal',
      description: 'Molho feito à mão.',
      price: 19.9,
      originalPrice: null,
      categoryId: 'molhos',
      fulfillmentMode: 'MADE_TO_ORDER',
    });

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    httpTestingController
      .expectOne(`${environment.apiUrl}/products`)
      .flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Não foi possível cadastrar o produto.',
    );
    expect(fixture.componentInstance['isSaving']()).toBe(false);
  });
});
