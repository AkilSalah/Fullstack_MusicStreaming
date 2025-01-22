import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'
  constructor(private http:HttpClient) { }

  register(user : User):Observable<any>{
    return this.http.post(`${this.baseUrl}/register`,user)
  }
  login(user : User) : Observable<any>{
    return this.http.post(`${this.baseUrl}/login`,user)
  }
  logout(token:string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/logout`, {}, { headers });
  }
}
