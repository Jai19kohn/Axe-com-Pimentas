import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../../cart/cart-service';
import { environment } from '../../../../environments/environment';

import { ProductDetails } from './product-details';

describe('ProductDetails', () => {
  let component: ProductDetails;
  let fixture: ComponentFixture<ProductDetails>;
  let cartService: CartService;
  let httpTestingController: HttpTestingController;
  let routeParameters: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    routeParameters = new BehaviorSubject(convertToParamMap({ id: '1' }));

    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParameters.asObservable(),
            snapshot: { paramMap: routeParameters.value },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    httpTestingController.expectOne(`${environment.apiUrl}/products`).flush([
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        price: 199.99,
        originalPrice: 249.99,
        categoryId: 'audio',
        fulfillmentMode: 'READY_TO_SHIP',
      },
    ]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows product details and its available discount', () => {
    fixture.detectChanges();
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    expect(fixture.nativeElement.textContent).toContain('Premium Wireless Headphones');
    expect(fixture.nativeElement.textContent).toContain(formatter.format(199.99));
    expect(fixture.nativeElement.textContent).toContain(formatter.format(249.99));
    expect(fixture.nativeElement.textContent).toContain(formatter.format(50));
  });

  it('adds the current product to the cart', () => {
    fixture.detectChanges();
    const addButton = fixture.nativeElement.querySelector(
      '.add-to-cart-button',
    ) as HTMLButtonElement | null;

    addButton?.click();
    fixture.detectChanges();

    expect(cartService.items()).toHaveLength(1);
    expect(cartService.items()[0].product.id).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Produto adicionado.');
  });

  it('shows a not found state for an unknown product id', () => {
    routeParameters.next(convertToParamMap({ id: '999' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Produto não encontrado');
    expect(fixture.nativeElement.querySelector('.add-to-cart-button')).toBeNull();
  });
});
