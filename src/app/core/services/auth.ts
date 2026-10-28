import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly authorizationSignal = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this.authorizationSignal() !== null);

  login(username: string, password: string): Observable<void> {
    const authorization = this.createAuthorization(username, password);
    return this.http
      .get<void>(`${environment.apiUrl}/admin/session`, {
        headers: new HttpHeaders({ Authorization: authorization }),
      })
      .pipe(
        tap(() => this.authorizationSignal.set(authorization)),
      );
  }

  logout(): void {
    this.authorizationSignal.set(null);
  }

  authorizationHeaders(): HttpHeaders {
    const authorization = this.authorizationSignal();
    return authorization ? new HttpHeaders({ Authorization: authorization }) : new HttpHeaders();
  }

  private createAuthorization(username: string, password: string): string {
    const bytes = new TextEncoder().encode(`${username}:${password}`);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return `Basic ${btoa(binary)}`;
  }
}
