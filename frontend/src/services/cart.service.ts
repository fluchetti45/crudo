import { inject, Injectable } from '@angular/core';
import { CartItem } from '../app/models/cart/cartItem.iterface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../app/models/cart/cart.interface';
import { AddCartItem } from '../app/models/cart/addCartItem.interface';
import { Order, ShippingData } from '../app/models/order/order.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _http = inject(HttpClient);
  private _url = environment.apiURL + 'cart';

  constructor() {}

  addToCart(item: AddCartItem): Observable<CartItem> {
    const dto = {
      ProductId: item.productId,
      Quantity: item.quantity,
      UnitPrice: item.price,
    };
    return this._http.post<CartItem>(this._url, dto);
  }

  getCartItems(): Observable<Cart> {
    return this._http.get<Cart>(`${this._url}`);
  }

  deleteCartItem(itemId: number): Observable<boolean> {
    return this._http.delete<boolean>(`${this._url}/${itemId}`);
  }

  updateCartItemQuantity(
    itemId: number,
    quantity: number
  ): Observable<CartItem> {
    return this._http.put<CartItem>(`${this._url}/${itemId}`, quantity);
  }

  checkoutCart(shippingData: ShippingData): Observable<Order> {
    return this._http.post<Order>(`${this._url}/checkout`, shippingData);
  }

  getUserCart() {
    return this._http.get<CartItem[]>(this._url);
  }
}
