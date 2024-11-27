import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Role2 } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RoleService {
    apiUrl: any;
    constructor(private http: HttpClient) { }

    getAll() {
      return this.http.get<Role2[]>(`${environment.apiUrl}/roles`);
    }

    // getById(id: number) {
    //     return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    // }

    // delete(id: number): Observable<any> {
    //   return this.http.delete(`${this.apiUrl}/${id}`);
    // }

    // create(user: User) {
    //   return this.http.post(`/users`, user);
    // }

    // update(id: number, user: User) {
    //   return this.http.put(`/users/${id}`, user);
    // }

}
