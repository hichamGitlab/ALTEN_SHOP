import {
  Component,
  inject,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "app/shared/services/cart.service";
import { CartViewComponent } from "./shared/features/cart/cart-view.component";
import { ToastService } from "./shared/services/toast.service";
import { effect } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, SidebarModule, ToastModule, PanelMenuComponent, CartViewComponent],
  providers: [MessageService]
})
export class AppComponent {
  title = "ALTEN SHOP";
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly messageService = inject(MessageService);

  // expose the computed signal to the template
  public readonly totalItems = this.cartService.totalItems;
  public readonly cartVisible = signal(false);

  constructor() {
    // Sync ToastService messages with PrimeNG MessageService
    effect(() => {
      const messages = this.toastService.messages();
      if (messages.length > 0) {
        messages.forEach(msg => {
          this.messageService.add(msg);
        });
        this.toastService.clear();
      }
    });
  }

  openCart() {
    this.cartVisible.set(true);
  }

  closeCart() {
    this.cartVisible.set(false);
  }
}
