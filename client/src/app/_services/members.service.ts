import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../_models/member';
import {map, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  members : Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers(){
    if(this.members.length > 0) return of(this.members)
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members =>{
        this.members = members
        return members
      })
    )
    //not needed any more now that jwt interceptor is in place
    //return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions())
  }

  //member deets are conveniently housed in the member list, so if that was already loaded you can get it from there without phoning home
  getMember(username:string){
    const member = this.members.find(x => x.userName === username)
    if(member) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
    //not needed any more now that jwt interceptor is in place
    //return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions());
  }

  //cached data needs updated so that the user can see his update details if he re-nav'd to his profile after updates
  updateMember(member:Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(()=>{
        const index = this.members.indexOf(member)
        //... is the spread operator will spread all the propertied of the member at this.members specified index and will map then
        // the properties from the parameter and updated member 1 to 1 , because they are the same type it will update each field with out
        // a literal loop needed to be defined
        this.members[index] = {...this.members[index], ...member}
      })
    )
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
