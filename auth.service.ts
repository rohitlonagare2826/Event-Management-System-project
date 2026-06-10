import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  // ─── Login ───────────────────────────────────────────────────
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  // ─── Register ────────────────────────────────────────────────
  register(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password });
  }

  // ─── Save session after login ────────────────────────────────
  saveSession(token: string, email: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
  }

  // ─── Get token ───────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ─── Get logged-in user email ────────────────────────────────
  getEmail(): string {
    return localStorage.getItem('email') || '';
  }

  // ─── Get role ────────────────────────────────────────────────
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // ─── Check if logged in ──────────────────────────────────────
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ─── Logout ──────────────────────────────────────────────────
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
