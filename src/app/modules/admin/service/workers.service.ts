import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { MeroType } from '../mero-type';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  addWorker(data: MeroType): Observable<MeroType> {
    const adminId = this.authService.getAdminId();
    const workerData = { ...data, adminId };
    return this.http.post<MeroType>(`${this.apiUrl}/workers`, workerData)
      .pipe(
        catchError(error => throwError(() => new Error('Failed to add worker')))
      );
  }

  getWorkers(): Observable<MeroType[]> {
    const adminId = this.authService.getAdminId();
    return this.http.get<MeroType[]>(`${this.apiUrl}/workers?adminId=${adminId}`)
      .pipe(
        catchError(error => throwError(() => new Error('Failed to fetch workers')))
      );
  }

  editWorker(id: number, updatedData: Partial<MeroType>): Observable<MeroType> {
    return this.http.patch<MeroType>(`${this.apiUrl}/workers/${id}`, updatedData)
      .pipe(
        catchError(error => throwError(() => new Error('Failed to edit worker')))
      );
  }

  deleteWorker(id: number): Observable<MeroType> {
    return this.http.delete<MeroType>(`${this.apiUrl}/workers/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error('Failed to delete worker')))
      );
  }

  getWorkersPaginated(
    page: number,
    pageSize: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
    filter: string
  ): Observable<{ data: MeroType[]; total: number }> {
    const adminId = this.authService.getAdminId();
    
    let params = new HttpParams()
      .set('adminId', adminId)
      .set('_page', page.toString())
      .set('_limit', pageSize.toString())
      .set('_sort', sortField)
      .set('_order', sortOrder);

    if (filter) {
      params = params.set('q', filter);
    }
    return this.http.get<MeroType[]>(`${this.apiUrl}/workers`, { 
      params,
      observe: 'response'
    }).pipe(
      map(response => ({
        data: response.body as MeroType[],
        total: Number(response.headers.get('X-Total-Count')) || 0
      })),
      catchError(error => throwError(() => new Error('Failed to fetch workers')))
    );
  }
}