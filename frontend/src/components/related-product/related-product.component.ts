import { Component, Input } from '@angular/core';
import { Product } from '../../app/models/products/product.interface';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';

import { getProduct } from '../../app/state/actions/products.actions';

@Component({
  selector: 'app-related-product',
  imports: [RouterLink, CurrencyPipe, NgClass, NgIf],
  templateUrl: './related-product.component.html',
  styleUrl: './related-product.component.css',
})
export class RelatedProductComponent {
  @Input() product!: Product;

  constructor(private _store: Store<AppState>) {}
  handleClick() {
    if (this.product.stock > 0) {
      var productId = this.product.id.toString();

      this._store.dispatch(getProduct({ productId }));
    }
  }
}
