import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  // Event form fields
  title       = '';
  date        = '';
  venue       = '';
  description = '';

  // Data holders
  events:        any[] = [];
  registrations: any[] = [];

  // Form feedback
  formError   = '';
  formSuccess = '';

  // Session info from JWT
  organizerEmail = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.organizerEmail = this.auth.getEmail();
    this.loadEvents();
  }

  // ─── Validation ──────────────────────────────────────────────
  isValidDate(date: string): boolean {
    return !!date && !isNaN(Date.parse(date));
  }

  // ─── Create Event ─────────────────────────────────────────────
  createEvent() {
    this.formError   = '';
    this.formSuccess = '';

    if (!this.title.trim()) {
      this.formError = 'Event title is required.'; return;
    }
    if (this.title.trim().length < 3) {
      this.formError = 'Title must be at least 3 characters.'; return;
    }
    if (!this.date) {
      this.formError = 'Please select an event date.'; return;
    }
    if (!this.isValidDate(this.date)) {
      this.formError = 'Please enter a valid date.'; return;
    }
    if (!this.venue.trim()) {
      this.formError = 'Venue is required.'; return;
    }

    const eventData = {
      title:       this.title.trim(),
      date:        this.date,
      venue:       this.venue.trim(),
      description: this.description.trim()
      // organizerEmail is set from JWT on backend — not sent here
    };

    this.http.post('http://localhost:3000/api/create-event', eventData).subscribe({
      next: () => {
        this.formSuccess = 'Event created successfully!';
        this.clearForm();
        this.loadEvents();
        setTimeout(() => this.formSuccess = '', 3000);
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to create event.';
      }
    });
  }

  // ─── Load Events ─────────────────────────────────────────────
  loadEvents() {
    this.http.get<any[]>('http://localhost:3000/api/events').subscribe({
      next: (res) => {
        this.events = res;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  // ─── Delete Event ─────────────────────────────────────────────
  deleteEvent(id: string) {
    this.http.delete(`http://localhost:3000/api/event/${id}`).subscribe({
      next: () => {
        this.events = this.events.filter(e => e._id !== id);
        this.registrations = [];
      },
      error: () => {}
    });
  }

  // ─── View Registrations ───────────────────────────────────────
  viewRegistrations(event: any) {
    this.http.get<any[]>(`http://localhost:3000/api/event-registrations/${event._id}`).subscribe({
      next: (res) => {
        this.registrations = res;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  closeRegistrations() {
    this.registrations = [];
  }

  clearForm() {
    this.title       = '';
    this.date        = '';
    this.venue       = '';
    this.description = '';
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  logout() {
    this.auth.logout();
  }
}
