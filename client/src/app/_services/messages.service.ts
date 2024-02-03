import {Injectable, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {getPaginatedResults, getPaginationHeaders} from "./PaginationHelper";
import {Message} from "../_models/message";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container:string){
    let params = getPaginationHeaders(pageNumber,pageSize)
    params = params.append('Container', container)
    return getPaginatedResults<Message[]>(this.baseUrl + 'messages', params, this.http)
  }

  getMessageThreads(username:string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username)
  }

}
