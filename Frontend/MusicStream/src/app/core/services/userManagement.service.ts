import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8080/api/admin/users"

  constructor(private http : HttpClient) { }

  getUsers():Observable<any>{
  return this.http.get(`${this.baseUrl}`)  
  }

  updateUserRoles(id: string, roles: string[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/roles`, roles)
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
