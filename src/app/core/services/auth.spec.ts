import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Auth);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('authenticates with the backend and keeps credentials in memory for the active session', () => {
    service.login('admin', 'senha-segura').subscribe();
    const request = httpTestingController.expectOne(`${environment.apiUrl}/admin/session`);

    expect(request.request.headers.get('Authorization')).toBe(
      `Basic ${btoa('admin:senha-segura')}`,
    );
    request.flush(null);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.authorizationHeaders().has('Authorization')).toBe(true);

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.authorizationHeaders().has('Authorization')).toBe(false);
  });

  it('does not store credentials when backend authentication fails', () => {
    service.login('admin', 'incorreta').subscribe({ error: () => undefined });
    httpTestingController
      .expectOne(`${environment.apiUrl}/admin/session`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(service.isAuthenticated()).toBe(false);
  });
});
