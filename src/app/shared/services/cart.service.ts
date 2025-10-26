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
            const existingItem = cart.items.find(item => item.productId === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.items.push({ productId: product.id, quantity: 1 });
            }
            cart.total = this.calculateTotal(cart.items, product.price);
            return cart;
        });
    }

    removeFromCart(productId: number) {
        this._cart.update(cart => {
            const itemIndex = cart.items.findIndex(item => item.productId === productId);
            if (itemIndex > -1) {
                if (cart.items[itemIndex].quantity > 1) {
                    cart.items[itemIndex].quantity--;
                } else {
                    cart.items.splice(itemIndex, 1);
                }
            }
            return cart;
        });
    }

    private calculateTotal(items: CartItem[], price: number): number {
        return items.reduce((total, item) => total + (item.quantity * price), 0);
    }
}