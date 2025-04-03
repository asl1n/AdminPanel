import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface Admin {
  id: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private sessionTime = 30 * 60 * 1000;

  constructor(private router: Router, private http: HttpClient) {}

  private setToken(token: string) {
    localStorage.setItem('token', token);
    this.sessionTimeout();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setAdminId(adminId: string) {
    localStorage.setItem('adminId', adminId);
  }

  getAdminId(): string {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      this.logout();
      throw new Error('No admin ID found');
    }
    return adminId;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    this.router.navigate(['login']);
  }

  signup({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Observable<any> {
    const newAdmin = { email, password };
    return this.http.post<Admin>(`${this.apiUrl}/admins`, newAdmin).pipe(
      map((admin) => {
        this.setToken(admin.id);
        this.setAdminId(admin.id);
        return { success: true, admin };
      }),
      catchError((error) => throwError(() => new Error('Signup failed')))
    );
  }

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.get<Admin[]>(`${this.apiUrl}/admins?email=${email}`).pipe(
      map((admins) => {
        const admin = admins[0];
        if (admin && admin.password === password) {
          this.setToken(admin.id);
          this.setAdminId(admin.id);
          return { success: true, admin };
        }
        throw new Error('Invalid credentials');
      }),
      catchError((error) => throwError(() => new Error('Invalid credentials')))
    );
  }

  sessionTimeout() {
    setTimeout(() => {
      this.logout();
      alert('Session timeout');
    }, this.sessionTime);
  }
}
