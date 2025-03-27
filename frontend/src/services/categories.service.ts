import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../app/models/categories/category.interface';
import { environment } from '../environments/environment';
import { UpdateCategory } from '../app/models/categories/updateCategory.interface';
import { TopCategory } from '../app/models/categories/topCategory.interface';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _http = inject(HttpClient);
  private _url = `${environment.apiURL}Category`;

  getCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(this._url);
  }

  getTopCategories(): Observable<TopCategory[]> {
    return this._http.get<TopCategory[]>(`${this._url}/top`);
  }

  getCategory(categoryId: number): Observable<Category> {
    return this._http.get<Category>(`${this._url}/${categoryId}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this._http.post<Category>(this._url, category);
  }

  deleteCategory(categoryId: number): Observable<boolean> {
    return this._http.delete<boolean>(`${this._url}/${categoryId}`);
  }

  updateCategory(updateCategory: UpdateCategory): Observable<Category> {
    return this._http.put<Category>(
      `${this._url}/${updateCategory.id}`,
      updateCategory
    );
  }
}
