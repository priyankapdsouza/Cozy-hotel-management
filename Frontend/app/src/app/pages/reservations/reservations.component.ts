import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {
  form: FormGroup;
  reservations: any[] = [];
  availableTables: any[] = [];
  loading = false;
  checkLoading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public auth: AuthService
  ) {
    this.form = this.fb.group({
      reservationDate: ['', Validators.required],
      reservationTime: ['', Validators.required],
      guests: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      tableId: ['', Validators.required],
      specialRequests: ['']
    });
  }

  ngOnInit() {
    if (this.auth.isAdmin()) {
      this.api.getAllReservations().subscribe((r: any[]) => this.reservations = r);
    } else {
      this.api.getMyReservations().subscribe((r: any[]) => this.reservations = r);
    }
  }

  checkAvailability() {
    const v = this.form.value;
    if (!v.reservationDate || !v.reservationTime || !v.guests) return;
    this.checkLoading = true;
    this.api.checkAvailability(v.reservationDate, v.reservationTime, v.guests).subscribe({
      next: (t: any[]) => { this.availableTables = t; this.checkLoading = false; },
      error: () => { this.checkLoading = false; }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.api.createReservation(this.form.value).subscribe({
      next: () => {
        this.form.reset({ guests: 2 });
        this.availableTables = [];
        if (this.auth.isAdmin()) this.api.getAllReservations().subscribe((r: any[]) => this.reservations = r);
        else this.api.getMyReservations().subscribe((r: any[]) => this.reservations = r);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  cancel(id: number) {
    if (!confirm('Cancel reservation?')) return;
    this.api.cancelReservation(id).subscribe(() => {
      if (this.auth.isAdmin()) this.api.getAllReservations().subscribe((r: any[]) => this.reservations = r);
      else this.api.getMyReservations().subscribe((r: any[]) => this.reservations = r);
    });
  }
}
