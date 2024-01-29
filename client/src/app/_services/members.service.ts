import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl + 'users')
    //not needed any more now that jwt interceptor is in place
    //return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions())
  }

  getMember(username:string){
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
    //not needed any more now that jwt interceptor is in place
    //return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions());
  }

  //need a way to pass authentication, the wrong way first then the proper way later 
  // getHttpOptions(){
  //   const userString = localStorage.getItem('user')
  //   if(!userString) return;
  //   const user = JSON.parse(userString)
  //   return{
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }

}
