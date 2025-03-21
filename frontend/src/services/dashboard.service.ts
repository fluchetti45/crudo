import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _http = inject(HttpClient);
  private _url = `${environment.apiURL}dashboard`;

  getDashboardData(): Observable<any> {
    return this._http.get<any>(this._url);
  }
}
