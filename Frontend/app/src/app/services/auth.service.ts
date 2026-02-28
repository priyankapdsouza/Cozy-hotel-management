import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(null);

  user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userSignal());
  isAdmin = computed(() => this.userSignal()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  private loadUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userSignal.set(JSON.parse(userStr));
    }
  }

  register(data: { name: string; email: string; password: string; phone?: string; address?: string }) {
    return this.http.post<{ user: User; accessToken: string; refreshToken: string }>(
      `${environment.apiUrl}/auth/register`,
      data
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ user: User; accessToken: string; refreshToken: string }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    );
  }

  setSession(user: User, accessToken: string, refreshToken: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.userSignal.set(user);
  }

  logout() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Fire-and-forget logout call; UI will log out even if request fails
      this.http
        .post(
          `${environment.apiUrl}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .subscribe({
          next: () => {},
          error: () => {}
        });
    }

    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.userSignal.set(null);
    this.router.navigate(['/']);
  }

  updateUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSignal.set(user);
  }
}
