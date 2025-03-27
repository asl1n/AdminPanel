import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MeroType } from '../mero-type';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addWorker(data: MeroType): Observable<MeroType> {
    return this.http.post<MeroType>(this.apiUrl, data);
  }

  getWorkers(): Observable<MeroType[]>{
    return this.http.get<MeroType[]>(this.apiUrl);
  }

  editWorker(id: number, updatedData: Partial<MeroType>): Observable<MeroType> {
    return this.http.patch<MeroType>(`${this.apiUrl}/${id}`, updatedData);
  }  

  deleteWorker(id: number): Observable<MeroType> {
    return this.http.delete<MeroType>(`${this.apiUrl}/${id}`);
  }
}
