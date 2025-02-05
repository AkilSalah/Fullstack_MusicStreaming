import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user).pipe(
      tap((response) => {
        if (response.token) {
          this.saveSession(response.token, response.roles);
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) return new Observable(observer => observer.complete());

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.baseUrl}/logout`, {}, { headers, responseType: 'text' }).pipe(
      tap(() => this.clearSession())
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ADMIN');
  }

  private saveSession(token: string, roles: any[]): void {
    localStorage.setItem('token', token);
    const roleNames = roles ? roles.map((role: any) => role.name) : [];
    localStorage.setItem('roles', JSON.stringify(roleNames));
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }
}
