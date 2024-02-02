import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Member } from '../_models/member';
import {map, of, take} from "rxjs";
import {PaginatedResult} from "../_models/pagination";
import {UserParams} from "../_models/userParams";
import {AccountService} from "./account.service";
import {User} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  members : Member[] = [];
  memberCache = new Map()
  user: User | undefined
  userParams : UserParams | undefined

  //its oke to inject services into other service=s just make sure the other service doesnt inject this service too!
  constructor(private http: HttpClient, private accountService : AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          this.userParams = new UserParams(user)
          this.user = user
        }
      }
    })
  }

  getUserParams(){
    return this.userParams
  }

  setUserParams(params : UserParams){
    this.userParams = this.userParams
  }

  resetUserParams(){
    if(this.user){
      this.userParams = new UserParams(this.user)
      return this.userParams
    }
    return
  }
  getMembers(userParams : UserParams){
    let queryKey = Object.values(userParams).join('-')
    console.log("query key : ",queryKey)
    const response = this.memberCache.get(queryKey)
    if(response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    console.log("Getting members form params: ", userParams)
    params = params.append('minAge', userParams.minAge)
    params = params.append('maxAge', userParams.maxAge)
    params = params.append('gender', userParams.gender)
    params = params.append('orderBy', userParams.orderBy)

    let results = this.getPaginatedResults<Member[]>(this.baseUrl + 'users',params);

    return this.getPaginatedResults<Member[]>(this.baseUrl + 'users',params).pipe(
      map(response => {
        this.memberCache.set(queryKey, response)
        return response
      })
    );
    //if(this.members.length > 0) return of(this.members)
    //return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      //disabled caching for testing purposes
      // map(members =>{
      //   this.members = members
      //   return members
      // })
    //)
    //not needed any more now that jwt interceptor is in place
    //return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions())
  }


//member deets are conveniently housed in the member list, so if that was already loaded you can get it from there without phoning home
  getMember(username:string){
    const member = [...this.memberCache.values()]
      .reduce((arr,element) => arr.concat(element.result), [])
      .find((member: Member) => member.userName === username)

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

  setMainPhoto(photId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photId, {})
  }

  deletePhoto(photoId:number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId)
  }

  addLike(username : string){
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate: string, pageNumber: number, pageSize:number){
    let params = this.getPaginationHeaders(pageNumber,pageSize)
    params = params.append('predicate', predicate)

    return this.getPaginatedResults<Member[]>(this.baseUrl + 'likes', params)
  }

  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const paginatedResult : PaginatedResult<T> = new PaginatedResult<T>
    return this.http.get<T>(url, {observe: 'response', params}).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body
        }
        const pagination = response.headers.get('Pagination')
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination)
        }
        return paginatedResult
      })
    )
  }

  private getPaginationHeaders(pageNumber:number, pageSize:number) {
    let params = new HttpParams()
    params = params.append('pageNumber', pageNumber)
    params = params.append('pageSize', pageSize)
    return params;
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
