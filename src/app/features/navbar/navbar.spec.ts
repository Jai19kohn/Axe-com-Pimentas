import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { routes } from '../../app.routes';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to the cart when its navbar link is clicked', async () => {
    fixture.detectChanges();
    const cartLink = fixture.nativeElement.querySelector(
      'a[aria-label="Abrir carrinho"]',
    ) as HTMLAnchorElement | null;

    expect(cartLink).not.toBeNull();
    cartLink?.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/cart');
  });

  it('navigates back to home when the store link is clicked', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/cart');
    fixture.detectChanges();

    const homeLink = fixture.nativeElement.querySelector(
      'a[aria-label="Ir para a página inicial"]',
    ) as HTMLAnchorElement | null;

    expect(homeLink).not.toBeNull();
    homeLink?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });
});
