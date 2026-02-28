import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(`${this.base}/categories`);
  }

  getMenu(params?: { categoryId?: number; search?: string; minPrice?: number; maxPrice?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null && v !== '') httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<any[]>(`${this.base}/menu`, { params: httpParams });
  }

  getTables() {
    return this.http.get<any[]>(`${this.base}/tables`);
  }

  // Reservations
  checkAvailability(date: string, time: string, guests: number) {
    return this.http.get<any[]>(`${this.base}/reservations/availability`, {
      params: { reservationDate: date, reservationTime: time, guests }
    });
  }

  getMyReservations() {
    return this.http.get<any[]>(`${this.base}/reservations/my`);
  }

  getAllReservations() {
    return this.http.get<any[]>(`${this.base}/reservations/all`);
  }

  createReservation(data: any) {
    return this.http.post<any>(`${this.base}/reservations`, data);
  }

  updateReservation(id: number, data: any) {
    return this.http.put<any>(`${this.base}/reservations/${id}`, data);
  }

  cancelReservation(id: number) {
    return this.http.delete(`${this.base}/reservations/${id}`);
  }

  // Orders
  createOrder(items: { menuItemId: number; quantity: number }[]) {
    return this.http.post<any>(`${this.base}/orders`, { items });
  }

  getMyOrders() {
    return this.http.get<any[]>(`${this.base}/orders/my`);
  }

  getAllOrders() {
    return this.http.get<any[]>(`${this.base}/orders/all`);
  }

  getOrder(id: number) {
    return this.http.get<any>(`${this.base}/orders/${id}`);
  }

  updateOrderStatus(id: number, status: string) {
    return this.http.put<any>(`${this.base}/orders/${id}/status`, { status });
  }

  cancelOrder(id: number) {
    return this.http.delete(`${this.base}/orders/${id}`);
  }

  payOrder(id: number, paymentPayload: any) {
    return this.http.post<any>(`${this.base}/orders/${id}/payment`, paymentPayload);
  }

  // Users
  getProfile() {
    return this.http.get<any>(`${this.base}/users/profile`);
  }

  updateProfile(data: any) {
    return this.http.put<any>(`${this.base}/users/profile`, data);
  }

  // Feedback
  submitFeedback(data: any) {
    return this.http.post<any>(`${this.base}/feedback`, data);
  }

  getMyFeedback() {
    return this.http.get<any[]>(`${this.base}/feedback/my`);
  }

  getAllFeedback() {
    return this.http.get<any[]>(`${this.base}/feedback/all`);
  }

  // Admin
  getAllUsers() {
    return this.http.get<any[]>(`${this.base}/users`);
  }

  createCategory(data: any) {
    return this.http.post<any>(`${this.base}/categories`, data);
  }

  updateCategory(id: number, data: any) {
    return this.http.put<any>(`${this.base}/categories/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.base}/categories/${id}`);
  }

  createMenuItem(formData: FormData) {
    return this.http.post<any>(`${this.base}/menu`, formData);
  }

  updateMenuItem(id: number, formData: FormData) {
    return this.http.put<any>(`${this.base}/menu/${id}`, formData);
  }

  deleteMenuItem(id: number) {
    return this.http.delete(`${this.base}/menu/${id}`);
  }
}
