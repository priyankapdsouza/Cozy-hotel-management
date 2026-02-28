import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  paymentMethod = 'cod';
  cardDetails = {
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddressLine1: '',
    billingCity: '',
    billingPostalCode: ''
  };

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.api.getMyOrders().subscribe(o => this.orders = o);
    const id = this.route.snapshot.queryParams['orderId'];
    if (id) this.viewOrder(parseInt(id));
  }

  viewOrder(order: any) {
    this.api.getOrder(order.id).subscribe(o => { this.selectedOrder = o; });
  }

  private buildPaymentPayload() {
    const base: any = { paymentMethod: this.paymentMethod };
    if (this.paymentMethod === 'card') {
      return {
        ...base,
        ...this.cardDetails
      };
    }
    return base;
  }

  pay(form?: NgForm) {
    if (!this.selectedOrder) return;
    if (this.paymentMethod === 'card' && form && form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = this.buildPaymentPayload();
    this.api.payOrder(this.selectedOrder.id, payload).subscribe({
      next: (o) => {
        this.selectedOrder = o;
        this.api.getMyOrders().subscribe(ord => this.orders = ord);
      }
    });
  }

  closeOrder() { this.selectedOrder = null; }
}
