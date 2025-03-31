import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Product } from '../../app/models/products/product.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { Observable, of } from 'rxjs';
import {
  selectLoading,
  selectProductDelete,
} from '../../app/state/selectors/products.selectors';
import { deleteProduct } from '../../app/state/actions/products.actions';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { ProductDetail } from '../../app/models/products/productDetail.interface';
import { UiBlockRelatedProductsComponent } from '../ui-block-related-products/ui-block-related-products.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { addProduct } from '../../app/state/actions/cart.actions';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../app/state/actions/wishlist.actions';
import { selectIsInWishlist } from '../../app/state/selectors/wishlist.selectors';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    NgFor,
    NgIf,
    RouterLink,
    AsyncPipe,
    CurrencyPipe,
    UiBlockRelatedProductsComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  @Input() product!: ProductDetail;
  @ViewChild('quantityInput') quantityInput!: ElementRef;
  private _router = inject(Router);
  private auth = inject(AuthService);
  isAuthenticated$ = this.auth.isAuthenticated$;
  isAdmin$ = this.auth.user$.pipe(
    map((user: User | null | undefined) =>
      user?.['https://crudo.com/claims/roles']?.includes('Admin')
    )
  );

  selectedImage: any;
  modalOpen: boolean = false;
  isInWishlist$: Observable<boolean> = new Observable();
  loading$: Observable<boolean> = new Observable();
  relatedProducts$: Observable<Product[]> = new Observable();
  deletedProduct$: Observable<boolean> = new Observable();

  constructor(
    private _route: ActivatedRoute,
    private _store: Store<AppState>,
    private sanitizer: DomSanitizer
  ) {
    this.loading$ = this._store.select(selectLoading);
    this.deletedProduct$ = this._store.select(selectProductDelete);
  }

  ngOnInit(): void {
    console.log(this.product);
    if (this.product.productImages) {
      this.selectedImage = this.product.productImages[0];
    }
    this.isInWishlist$ = this._store.select(
      selectIsInWishlist(this.product.id)
    );
    this.deletedProduct$.subscribe({
      next: (res) => {
        if (res) {
          this._router.navigate(['/']);
        }
      },
    });
  }

  changeMainImage(image: any) {
    this.selectedImage = image;
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  onDelete() {
    var confirm = window.confirm('Borrar producto?');
    if (confirm) {
      this._store.dispatch(deleteProduct({ productId: this.product.id }));
    }
  }

  onEdit() {
    this._router.navigate(['/edit-product', this.product.id]);
  }

  addToWishlist(productId: number) {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        const currentUrl = window.location.pathname + window.location.search;
        this.auth.loginWithRedirect({
          appState: { target: currentUrl },
        });
        return;
      }
      this._store.dispatch(addToWishlist({ productId }));
    });
  }

  addToCart(productId: number, quantity: string) {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        const currentUrl = window.location.pathname + window.location.search;
        this.auth.loginWithRedirect({
          appState: { target: currentUrl },
        });
        return;
      }

      const quantityNumber = parseInt(quantity);
      this._store.dispatch(
        addProduct({
          item: {
            productId: this.product.id,
            productName: this.product.name,
            quantity: quantityNumber,
            price: this.product.price,
          },
          availableStock: this.product.stock,
        })
      );
    });
  }

  removeFromWishlist(productId: number) {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        const currentUrl = window.location.pathname + window.location.search;
        this.auth.loginWithRedirect({
          appState: { target: currentUrl },
        });
        return;
      }
      this._store.dispatch(removeFromWishlist({ productId }));
    });
  }
}
