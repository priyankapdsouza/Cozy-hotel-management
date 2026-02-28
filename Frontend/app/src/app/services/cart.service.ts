import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSignal = signal<CartItem[]>([]);

  cart = this.cartSignal.asReadonly();
  totalItems = computed(() =>
    this.cartSignal().reduce((sum, i) => sum + i.quantity, 0)
  );
  subtotal = computed(() =>
    this.cartSignal().reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  tax = computed(() => Math.round(this.subtotal() * 0.1 * 100) / 100);
  total = computed(() => Math.round((this.subtotal() + this.tax()) * 100) / 100);

  addItem(item: { id: number; name: string; price: number; imageUrl?: string }, qty = 1) {
    const cart = [...this.cartSignal()];
    const idx = cart.findIndex((i) => i.menuItemId === item.id);
    if (idx >= 0) {
      cart[idx].quantity += qty;
    } else {
      cart.push({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: qty,
        imageUrl: item.imageUrl
      });
    }
    this.cartSignal.set(cart);
  }

  updateQuantity(menuItemId: number, delta: number) {
    const cart = this.cartSignal().map((i) =>
      i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + delta } : i
    ).filter((i) => i.quantity > 0);
    this.cartSignal.set(cart);
  }

  removeItem(menuItemId: number) {
    this.cartSignal.set(this.cartSignal().filter((i) => i.menuItemId !== menuItemId));
  }

  clear() {
    this.cartSignal.set([]);
  }
}
