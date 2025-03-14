import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { Status } from '../app/models/status/status.interface';
import { ShippingData } from '../app/models/order/order.interface';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private _http = inject(HttpClient);
  private url = `${environment.apiURL}shippingdata`;

  getShippingData(): Observable<ShippingData[]> {
    return this._http.get<ShippingData[]>(this.url);
  }

  createShippingData(shippingData: ShippingData): Observable<ShippingData> {
    return this._http.post<ShippingData>(this.url, shippingData);
  }

  deleteShippingData(shippingDataId: number) {
    return this._http.delete(`${this.url}/${shippingDataId}`);
  }

  editShippingData(shippingData: ShippingData): Observable<ShippingData> {
    return this._http.put<ShippingData>(
      `${this.url}/${shippingData.id}`,
      shippingData
    );
  }
}
