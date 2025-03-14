import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { Status } from '../app/models/status/status.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private _http = inject(HttpClient);
  private url = `${environment.apiURL}status`;

  getStatuses(): Observable<Status[]> {
    return this._http.get<Status[]>(this.url);
  }

  getStatus(statusId: number): Observable<Status> {
    return this._http.get<Status>(`${this.url}/${statusId}`);
  }

  createStatus(statusName: string): Observable<Status> {
    return this._http.post<Status>(this.url, { name: statusName });
  }

  updateStatus(status: Status): Observable<Status> {
    return this._http.put<Status>(`${this.url}/${status.id}`, status);
  }

  deleteStatus(statusId: number): Observable<Status> {
    return this._http.delete<Status>(`${this.url}/${statusId}`);
  }
}
