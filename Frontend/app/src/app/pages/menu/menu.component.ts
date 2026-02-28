import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  items: any[] = [];
  categories: any[] = [];
  loading = true;
  categoryFilter = '';
  searchTerm = '';

  constructor(
    private api: ApiService,
    public cart: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.api.getCategories().subscribe({
      next: (c) => { this.categories = c; },
      error: () => {}
    });
    this.loadMenu();
  }

  loadMenu() {
    this.loading = true;
    const params: any = {};
    if (this.categoryFilter) params.categoryId = this.categoryFilter;
    if (this.searchTerm) params.search = this.searchTerm;
    this.api.getMenu(params).subscribe({
      next: (m) => { this.items = m; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  imgUrl(path: string) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return environment.apiUrl.replace('/api', '') + path;
  }

  addToCart(item: any) {
    this.cart.addItem({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      imageUrl: item.imageUrl
    });
  }
}
