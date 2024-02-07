import {Injectable, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {getPaginatedResults, getPaginationHeaders} from "./PaginationHelper";
import {Message} from "../_models/message";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {User} from "../_models/user";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {BehaviorSubject, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl
  hubUrl = environment.hubUrl
  private hubConnection?: HubConnection
  private messageThreadSource = new BehaviorSubject<Message[]>([])
  messageThreads$ = this.messageThreadSource.asObservable()

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUsername : String){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory(): string | Promise<string> { return user.token}
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on('ReceiveMessageThread' ,messages =>{
      this.messageThreadSource.next(messages)
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThreads$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message])
        }
      })
    })
  }

  stopHubConnection(){
    if(this.hubConnection) this.hubConnection.stop()
  }

  getMessages(pageNumber: number, pageSize: number, container:string){
    let params = getPaginationHeaders(pageNumber,pageSize)
    params = params.append('Container', container)
    return getPaginatedResults<Message[]>(this.baseUrl + 'messages', params, this.http)
  }

  getMessageThreads(username:string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username)
  }

  sendMessage(username:string, content:string){
    return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
      .catch(error => console.log(error))
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseUrl + 'messages/' + id)
  }

}
