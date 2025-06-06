import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegister } from '../UserRegister';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private readonly API_URL = 'http://localhost:8080'; // Your backend server address

  constructor(private http: HttpClient) {}

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/api/register`, formData);
  }
  loginUser(credentials: { email: string, password: string }): Observable<any> {
  return this.http.post(`${this.API_URL}/api/login`, credentials);
}
logout(): void {
    localStorage.removeItem('user');
  }

  // Utility to get user from localStorage
  getUser(): UserRegister | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

}
