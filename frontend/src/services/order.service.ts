import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import {
  Order,
  OrderAdmin,
  ShippingData,
  OrderDetail,
} from '../app/models/order/order.interface';
import { PagedResult } from '../app/models/common/paged-result.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private _http = inject(HttpClient);
  private _url = `${environment.apiURL}Order`;

  createOrder(shippingData: ShippingData): Observable<Order> {
    return this._http.post<Order>(this._url, { shippingData });
  }

  getOrders(
    statusId: number | null,
    page: number = 1,
    pageSize: number = 5
  ): Observable<PagedResult<Order>> {
    console.log('getOrders', page, pageSize);
    let url = `${this._url}?page=${page}&pageSize=${pageSize}`;
    console.log('getOrders', url);
    return this._http.get<PagedResult<Order>>(url);
  }

  getOrdersAdmin(
    statusId: number | null,
    page: number = 1,
    pageSize: number = 5
  ): Observable<PagedResult<OrderAdmin>> {
    let url = `${this._url}/admin?page=${page}&pageSize=${pageSize}`;
    if (statusId !== null) {
      url += `&statusId=${statusId}`;
    }
    return this._http.get<PagedResult<OrderAdmin>>(url);
  }

  getUserOrdersAdmin(userId: string): Observable<OrderAdmin[]> {
    return this._http.get<OrderAdmin[]>(
      `${this._url}/admin/user?userId=${userId}`
    );
  }

  getOrder(orderId: number): Observable<OrderDetail> {
    return this._http.get<OrderDetail>(`${this._url}/${orderId}`);
  }

  updateOrder(orderId: number, newStatusId: number): Observable<OrderAdmin> {
    return this._http.put<OrderAdmin>(`${this._url}/${orderId}`, {
      newStatusId,
    });
  }
}
