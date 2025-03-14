import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ProductImage } from '../app/models/products/productDetail.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductImageService {
  private _http = inject(HttpClient);
  private url = `${environment.apiURL}ProductImage`;

  deleteImage(imageId: number): Observable<boolean> {
    return this._http.delete<boolean>(`${this.url}/${imageId}`);
  }

  uploadImage(productId: number, files: File[]): Observable<ProductImage[]> {
    const images = new FormData();
    files.forEach((file, index) => {
      images.append('images', file);
    });
    console.log('POR SUBIR IMAGENES AL PRODUCTO DE ID ', productId);
    console.log(images);
    console.log(files);
    return this._http.post<ProductImage[]>(`${this.url}/${productId}`, images);
  }

  updateCover(productId: number, coverId: number): Observable<boolean> {
    const data = { productId, coverId };
    console.log('mandando la data', data);
    return this._http.put<boolean>(`${this.url}/${coverId}`, data);
  }
}
