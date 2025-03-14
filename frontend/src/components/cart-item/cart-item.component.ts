import { Component, inject, Input, OnInit } from '@angular/core';
import { CartItem } from '../../app/models/cart/cartItem.iterface';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import {
  deleteCartItem,
  updateCartItemQuantity,
} from '../../app/state/actions/cart.actions';

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent implements OnInit {
  @Input() item!: CartItem;
  private _store: Store<AppState> = inject(Store<AppState>);

  ngOnInit(): void {}

  decreaseQuantity() {
    if (this.item.quantity == 1) return;
    this._store.dispatch(
      updateCartItemQuantity({ amount: -1, cartItemId: this.item.itemId })
    );
  }

  increaseQuantity() {
    this._store.dispatch(
      updateCartItemQuantity({ amount: 1, cartItemId: this.item.itemId })
    );
  }

  removeItem() {
    this._store.dispatch(deleteCartItem({ cartItemId: this.item.itemId }));
  }
}
