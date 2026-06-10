import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Login fields
  email    = '';
  password = '';

  // Register fields
  regEmail    = '';
  regPassword = '';

  showRegister = false;

  // Error/success messages
  loginError    = '';
  regError      = '';
  regSuccess    = '';

  submitted = false;

  constructor(private auth: AuthService, private router: Router,   private cdr: ChangeDetectorRef
) {}

  // ─── Validation helpers ──────────────────────────────────────
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPassword(password: string): boolean {
    return password.trim().length >= 6;
  }

  // ─── Login ───────────────────────────────────────────────────
  login() {
  this.submitted = true;
  this.loginError = '';

  // 🔴 Email required
  if (!this.email) {
    this.loginError = 'Email is required.';
    return;
  }

  // 🔴 Email format
  if (!this.isValidEmail(this.email)) {
    this.loginError = 'Please enter a valid email address.';
    return;
  }

  // 🔴 Password required
  if (!this.password) {
    this.loginError = 'Password is required.';
    return;
  }

  // 🔴 Password length
  if (!this.isValidPassword(this.password)) {
    this.loginError = 'Password must be at least 6 characters.';
    return;
  }

  // ✅ API call
  this.auth.login(this.email, this.password).subscribe({
    next: (res) => {
      this.auth.saveSession(res.token, res.email, res.role);
      if (res.role === 'organizer') this.router.navigate(['/organizer']);
      else this.router.navigate(['/user']);
    },
    error: (err) => {
  this.loginError = err?.error?.message || 'Invalid email or password.';

  this.cdr.detectChanges();   // 🔥 SAME FIX
}
  });
}

  // ─── Register ────────────────────────────────────────────────
  register() {
  this.regError   = '';
  this.regSuccess = '';

  if (!this.regEmail || !this.regPassword) {
    this.regError = 'Please fill in all fields.';
    return;
  }

  if (!this.isValidEmail(this.regEmail)) {
    this.regError = 'Please enter a valid email address.';
    return;
  }

  if (!this.isValidPassword(this.regPassword)) {
    this.regError = 'Password must be at least 6 characters.';
    return;
  }

  this.auth.register(this.regEmail, this.regPassword).subscribe({
  next: () => {
  this.regSuccess = 'Account created successfully!';
  this.regEmail = '';
  this.regPassword = '';

  this.cdr.detectChanges();   // 🔥 THIS LINE FIXES EVERYTHING
}
});
}

  openRegister() {
    this.showRegister = true;
    this.regError = '';
    this.regSuccess = '';
  }
}
