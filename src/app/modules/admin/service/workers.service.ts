import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
}