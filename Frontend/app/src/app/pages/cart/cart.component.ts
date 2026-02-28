import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  placing = false;

  constructor(
    public cart: CartService,
    private api: ApiService,
    private router: Router
  ) {}

  placeOrder() {
    if (this.cart.cart().length === 0) return;
    this.placing = true;
    const items = this.cart.cart().map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }));
    this.api.createOrder(items).subscribe({
      next: (order) => {
        this.cart.clear();
        this.router.navigate(['/my-orders'], { queryParams: { orderId: order.id } });
      },
      error: () => { this.placing = false; },
      complete: () => { this.placing = false; }
    });
  }
}
