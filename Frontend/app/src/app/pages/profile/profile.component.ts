import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  msg = '';

  constructor(private fb: FormBuilder, public auth: AuthService, private api: ApiService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: (u) => this.form.patchValue({ name: u.name, phone: u.phone || '', address: u.address || '' })
    });
  }

  save() {
    if (this.form.invalid) return;
    this.api.updateProfile(this.form.value).subscribe({
      next: (u) => {
        this.auth.updateUser(u);
        this.msg = 'Profile updated';
      }
    });
  }
}
