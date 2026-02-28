import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  tab = 'orders';
  orders: any[] = [];
  reservations: any[] = [];
  users: any[] = [];
  categories: any[] = [];
  menuItems: any[] = [];
  newCategory = { name: '', description: '' };
  newMenuItem: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getCategories().subscribe(c => this.categories = c);
    this.api.getMenu({}).subscribe(m => this.menuItems = m);
  }

  load() {
    this.api.getAllOrders().subscribe(o => this.orders = o);
    this.api.getAllReservations().subscribe(r => this.reservations = r);
    this.api.getAllUsers().subscribe(u => this.users = u);
  }

  addCategory() {
    this.api.createCategory(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { name: '', description: '' };
        this.api.getCategories().subscribe(c => this.categories = c);
      }
    });
  }

  updateOrderStatus(order: any, status: string) {
    this.api.updateOrderStatus(order.id, status).subscribe(() => this.load());
  }

  cancelOrder(order: any) {
    if (!confirm('Cancel order?')) return;
    this.api.updateOrderStatus(order.id, 'cancelled').subscribe(() => this.load());
  }

  addMenuItem() {
    const fd = new FormData();
    fd.append('name', this.newMenuItem.name || '');
    fd.append('description', this.newMenuItem.description || '');
    fd.append('price', this.newMenuItem.price || '0');
    fd.append('categoryId', this.newMenuItem.categoryId || '1');
    this.api.createMenuItem(fd).subscribe(() => {
      this.newMenuItem = {};
      this.api.getMenu({}).subscribe(m => this.menuItems = m);
    });
  }

  deleteItem(id: number) {
    if (!confirm('Delete?')) return;
    this.api.deleteMenuItem(id).subscribe(() => this.api.getMenu({}).subscribe(m => this.menuItems = m));
  }
}
