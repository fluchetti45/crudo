import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { Observable } from 'rxjs';
import { selectFilteredProducts } from '../../app/state/selectors/products.selectors';
import { ProductCardComponent } from '../product-card/product-card.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-blocks-products-category',
  imports: [ProductCardComponent, NgIf, NgFor, AsyncPipe],
  templateUrl: './ui-blocks-products-category.component.html',
  styleUrl: './ui-blocks-products-category.component.css',
})
export class UiBlocksProductsCategoryComponent {
  products$: Observable<any> = new Observable();

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this.products$ = this._store.select(selectFilteredProducts);
  }
}
