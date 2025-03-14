import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private _http = inject(HttpClient);
  private _url = `${environment.apiURL}Email`;

  subscribe(email: string): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(
      `${this._url}/subscribe`,
      { email }
    );
  }
}
