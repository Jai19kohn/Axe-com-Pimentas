import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../../environments/environment';
import { AdminLogin } from './admin-login';

@Component({ template: '' })
class ProductCreatePage {}

describe('AdminLogin', () => {
  let fixture: ComponentFixture<AdminLogin>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLogin],
      providers: [
        provideRouter([{ path: 'products/new', component: ProductCreatePage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminLogin);
    fixture.detectChanges();
  });

  it('authenticates with the backend before navigating to product registration', async () => {
    fixture.componentInstance['loginForm'].setValue({
      username: 'admin',
      password: 'senha-forte',
    });
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const request = httpTestingController.expectOne(`${environment.apiUrl}/admin/session`);
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe(`Basic ${btoa('admin:senha-forte')}`);
    request.flush(null);
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/products/new');
  });

  it('shows an explicit message when credentials are rejected', () => {
    fixture.componentInstance['loginForm'].setValue({
      username: 'admin',
      password: 'incorreta',
    });
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    httpTestingController
      .expectOne(`${environment.apiUrl}/admin/session`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Usuário ou senha inválidos.',
    );
  });
});
