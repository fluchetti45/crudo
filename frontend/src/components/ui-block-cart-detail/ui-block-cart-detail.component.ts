import { Component, inject, OnInit } from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { Observable } from 'rxjs';
import { CartItem } from '../../app/models/cart/cartItem.iterface';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import {
  selectCartItems,
  selectLoading,
  selectTotalAmount,
} from '../../app/state/selectors/cart.selectors';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { getCartItems } from '../../app/state/actions/cart.actions';
import { OrdersService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ui-block-cart-detail',
  imports: [CartItemComponent, NgFor, AsyncPipe, NgIf, CurrencyPipe],
  templateUrl: './ui-block-cart-detail.component.html',
  styleUrl: './ui-block-cart-detail.component.css',
})
export class UiBlockCartDetailComponent implements OnInit {
  items$: Observable<CartItem[]> = new Observable();
  total$: Observable<number> = new Observable();
  loading$: Observable<boolean> = new Observable();

  private _router = inject(Router);
  constructor(private _store: Store<AppState>) {}
  ngOnInit(): void {
    this._store.dispatch(getCartItems());
    this.total$ = this._store.select(selectTotalAmount);
    this.items$ = this._store.select(selectCartItems);
    this.loading$ = this._store.select(selectLoading);
  }

  onCheckout() {
    // Despachar la accion.
    this._router.navigate(['/checkout']);
  }
}
