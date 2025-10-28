import { Component, OnInit, inject, signal, computed, effect } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FormatPricePipe } from "app/shared/pipes/format-price.pipe";
import { TruncatePipe } from "app/shared/pipes/truncate.pipe";
import { CartService } from "app/shared/services/cart.service";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, InputTextModule, DropdownModule, FormsModule, ProductFormComponent, FormatPricePipe, TruncatePipe],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;
  public readonly cart = this.cartService.cart;

  // Pagination
  public readonly currentPage = signal(0);
  public readonly rowsPerPage = signal(10);
  public readonly totalRecords = computed(() => this.filteredProducts().length);

  // Filtrage
  public readonly searchTerm = signal('');
  public readonly selectedCategory = signal<string | null>(null);
  public readonly selectedStatus = signal<string | null>(null);

  // Options de filtrage
  public readonly categoryOptions = computed(() => {
    const categories = new Set(this.products().map(p => p.category));
    return Array.from(categories).map(cat => ({ label: cat, value: cat }));
  });

  public readonly statusOptions = [
    { label: 'Tous', value: null },
    { label: 'En stock', value: 'INSTOCK' },
    { label: 'Stock bas', value: 'LOWSTOCK' },
    { label: 'Rupture', value: 'OUTOFSTOCK' }
  ];

  // Produits filtrés
  public readonly filteredProducts = computed(() => {
    let filtered = this.products();

    // Filtre par recherche (nom ou catégorie)
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.price.toString().includes(search)
      );
    }

    // Filtre par catégorie
    const category = this.selectedCategory();
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filtre par statut
    const status = this.selectedStatus();
    if (status) {
      filtered = filtered.filter(p => p.inventoryStatus === status);
    }

    return filtered;
  });

  // Produits paginés
  public readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const page = this.currentPage();
    const rows = this.rowsPerPage();
    const start = page * rows;
    const end = start + rows;
    return filtered.slice(start, end);
  });

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.productsService.get().subscribe();

    // Reset pagination to first page when any filter changes
    effect(() => {
      // track dependencies
      this.searchTerm();
      this.selectedCategory();
      this.selectedStatus();
      // reset page
      this.currentPage.set(0);
    });
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  // used by template to provide a safe typed fallback when image loading fails
  public onImgError(event: Event) {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = 'assets/no-image.svg';
    }
  }

  public onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  public onRemoveFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  public isInCart(productId: number): boolean {
    return this.cart()?.items.some(item => item.productId === productId) ?? false;
  }

  // Méthodes de pagination
  public onPageChange(event: any) {
    this.currentPage.set(event.page);
    this.rowsPerPage.set(event.rows);
  }

  public resetFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.selectedStatus.set(null);
    this.currentPage.set(0);
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
