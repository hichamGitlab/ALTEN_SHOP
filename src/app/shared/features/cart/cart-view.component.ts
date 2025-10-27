import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { FormatPricePipe } from '../../pipes/format-price.pipe';

@Component({
    selector: 'app-cart-view',
    templateUrl: './cart-view.component.html',
    styleUrls: ['./cart-view.component.scss'],
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule, TooltipModule, FormatPricePipe]
})
export class CartViewComponent {
    private readonly cartService = inject(CartService);

    public readonly cart = this.cartService.cart;
    public readonly totalItems = this.cartService.totalItems;

    onRemoveItem(productId: number) {
        this.cartService.removeFromCart(productId);
    }

    onClearCart() {
        // Remove all items one by one
        const items = [...this.cart().items];
        items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                this.cartService.removeFromCart(item.productId);
            }
        });
    }

    onImgError(event: Event) {
        const target = event.target as HTMLImageElement | null;
        if (target) {
            target.src = 'assets/no-image.svg';
        }
    }
}
