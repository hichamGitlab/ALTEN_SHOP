/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from 'app/products/data-access/products.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductListComponent (integrated pipes)', () => {
    let fixture: any;
    const mockProduct = {
        id: 1,
        code: 'c1',
        name: 'Test product',
        description: 'Long description '.repeat(20),
        image: '', // missing image to test fallback
        category: 'Test',
        price: 65,
        quantity: 0,
        internalReference: 'REF-1',
        shellId: 0,
        inventoryStatus: 'INSTOCK',
        rating: 4,
        createdAt: 0,
        updatedAt: 0,
    };

    const mockService: Partial<ProductsService> = {
        products: signal([mockProduct]) as any,
        get: () => of([mockProduct]) as any,
        create: () => of(true) as any,
        update: () => of(true) as any,
        delete: () => of(true) as any,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductListComponent, NoopAnimationsModule],
            providers: [{ provide: ProductsService, useValue: mockService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        fixture.detectChanges();
    });

    it('renders a product card with fallback image, formatted price and truncated description', () => {
        const el: HTMLElement = fixture.nativeElement;
        const img = el.querySelector('img') as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.src).toContain('assets/no-image.svg');

        // Price contains currency symbol
        expect(el.textContent).toContain('€');

        // Truncated description should include ellipsis
        expect(el.textContent).toContain('...');
    });
});
