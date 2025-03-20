import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { WishlistItem } from '../app/models/wishlist/wishlistItem.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = `${environment.apiURL}wishlist`;

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl);
  }

  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(this.apiUrl, productId);
  }

  removeFromWishlist(itemId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${itemId}`);
  }

  clearWishlist(): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/clear`);
  }
}
