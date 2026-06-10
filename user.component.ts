import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  events: any[] = [];
  selectedEvent: any = null;

  userName  = '';
  contact   = '';
  className = '';

  formError   = '';
  formSuccess = '';

  // Session info from JWT (no more hardcoded email!)
  userEmail = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userEmail = this.auth.getEmail();
    this.loadEvents();
  }

  loadEvents() {
    this.http.get<any[]>('http://localhost:3000/api/events').subscribe({
      next: (res) => {
        this.events = [...res];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }

  openRegisterForm(event: any) {
    this.selectedEvent = event;
    this.formError   = '';
    this.formSuccess = '';
  }

  closeForm() {
    this.selectedEvent = null;
    this.userName  = '';
    this.contact   = '';
    this.className = '';
    this.formError   = '';
    this.formSuccess = '';
  }

  // ─── Validation ──────────────────────────────────────────────
  isValidContact(contact: string): boolean {
    return /^[6-9]\d{9}$/.test(contact);
  }

  // ─── Submit Registration ─────────────────────────────────────
  submitRegistration() {
    this.formError   = '';
    this.formSuccess = '';

    if (!this.userName.trim()) {
      this.formError = 'Please enter your name.'; return;
    }
    if (this.userName.trim().length < 2) {
      this.formError = 'Please enter your full name.'; return;
    }
    if (!this.contact.trim()) {
      this.formError = 'Please enter your contact number.'; return;
    }
    if (!this.isValidContact(this.contact.trim())) {
      this.formError = 'Please enter a valid 10-digit mobile number.'; return;
    }
    if (!this.className.trim()) {
      this.formError = 'Please enter your class.'; return;
    }

    const data = {
      eventId:    this.selectedEvent._id,
      eventTitle: this.selectedEvent.title,
      eventDate:  this.selectedEvent.date,
      venue:      this.selectedEvent.venue,
      userName:   this.userName.trim(),
      contact:    this.contact.trim(),
      className:  this.className.trim()
      // userEmail is taken from JWT on backend — not sent here
    };

    this.http.post('http://localhost:3000/api/register-event', data).subscribe({
      next: () => {
        this.formSuccess = 'Registered successfully!';
        setTimeout(() => this.closeForm(), 1500);
      },
      error: (err) => {
        this.formError = err.error?.message || 'Registration failed.';
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
