import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }
  getUsersWithRoles(){
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles')
  }

  updateUserRoles(username:string, roles:string[]){
    console.log("updating rolse for user: ",username , " Roles: ", roles, " Api Endpoint: ", this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles)
    return this.http.post<string[]>(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {})
  }
}
