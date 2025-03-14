import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '../../app/app.state';
import { Store } from '@ngrx/store';
import {
  selectFilteredProducts,
  selectProductList,
} from '../../app/state/selectors/products.selectors';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-ui-block-products',
  imports: [AsyncPipe, ProductCardComponent, NgIf, NgFor],
  templateUrl: './ui-block-products.component.html',
  styleUrl: './ui-block-products.component.css',
})
export class UiBlockProductsComponent implements OnInit {
  products$: Observable<any> = new Observable();

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this.products$ = this._store.select(selectProductList);
  }
}
