import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { MeroType } from '../mero-type';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAdminId(): string {
    const adminId = this.authService.getAdminId();
    if (!adminId) {
      throw new Error('No admin ID found');
    }
    return adminId;
  }

  // Get for proper backend search and pag
  getWorkers(
    page: number = 1,
    pageSize: number = 5,
    sortField: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    filter: string = ''
  ): Observable<{ data: MeroType[]; total: number }> {
    try {
      const adminId = this.getAdminId();

      //  params
      let params = new HttpParams()
        .set('adminId', adminId)
        .set('_page', page.toString())
        .set('_limit', pageSize.toString())
        .set('_sort', sortField)
        .set('_order', sortOrder);

      // Add search filters
      if (filter) {
        params = params
          .set('firstName_like', filter)
          .set('lastName_like', filter)
          .set('email_like', filter)
          .set('company_like', filter);
      }

      // First get total count
      const countParams = params
        .delete('_page')
        .delete('_limit')
        .delete('_sort')
        .delete('_order');

      return this.http
        .get<MeroType[]>(`${this.apiUrl}/workers`, { params: countParams })
        .pipe(
          switchMap((allResults) => {
            const total = allResults.length;
            return this.http
              .get<MeroType[]>(`${this.apiUrl}/workers`, { params })
              .pipe(
                map((paginatedResults) => ({
                  data: paginatedResults,
                  total: total,
                }))
              );
          }),
          catchError((error) =>
            throwError(() => new Error('Failed to fetch workers'))
          )
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  addWorker(data: Omit<MeroType, 'id'>): Observable<MeroType> {
    try {
      const adminId = this.getAdminId();
      const workerData = { ...data, adminId };
      return this.http.post<MeroType>(`${this.apiUrl}/workers`, workerData);
    } catch (error) {
      return throwError(() => error);
    }
  }

  deleteWorker(id: number): Observable<void> {
    try {
      this.getAdminId();
      return this.http.delete<void>(`${this.apiUrl}/workers/${id}`);
    } catch (error) {
      return throwError(() => error);
    }
  }

  editWorker(id: number, updatedData: Partial<MeroType>): Observable<MeroType> {
    try {
      this.getAdminId();
      return this.http.patch<MeroType>(
        `${this.apiUrl}/workers/${id}`,
        updatedData
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}
