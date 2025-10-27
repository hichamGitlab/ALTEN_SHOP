import { Injectable, computed, signal } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../../products/data-access/product.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly _cart = signal<Cart>({ items: [], total: 0 });
    public readonly cart = this._cart.asReadonly();

    public readonly totalItems = computed(() =>
        this._cart().items.reduce((sum, item) => sum + item.quantity, 0)
    );

    addToCart(product: Product) {
        this._cart.update(cart => {
            const items = [...cart.items];
            const index = items.findIndex(item => item.productId === product.id);
            if (index > -1) {
                const updated = { ...items[index], quantity: items[index].quantity + 1 };
                items[index] = updated;
            } else {
                items.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            const total = this.calculateTotal(items);
            return { ...cart, items, total };
        });
    }

    removeFromCart(productId: number) {
        this._cart.update(cart => {
            let items = cart.items.map(i => ({ ...i }));
            const itemIndex = items.findIndex(item => item.productId === productId);
            if (itemIndex > -1) {
                const nextQty = items[itemIndex].quantity - 1;
                if (nextQty > 0) {
                    items[itemIndex] = { ...items[itemIndex], quantity: nextQty };
                } else {
                    items = items.filter((_, idx) => idx !== itemIndex);
                }
            }
            const total = this.calculateTotal(items);
            return { ...cart, items, total };
        });
    }

    private calculateTotal(items: CartItem[]): number {
        return items.reduce((total, item) => total + (item.quantity * item.price), 0);
    }
}