import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^[0-9+\-\s()]{10,20}$/)],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      address: ['']
    });
  }

  submit() {
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        this.auth.setSession(res.user, res.accessToken, res.refreshToken);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.errors?.[0]?.msg || 'Registration failed';
        this.loading = false;
      },
      complete: () => { this.loading = false; }
    });
  }
}
