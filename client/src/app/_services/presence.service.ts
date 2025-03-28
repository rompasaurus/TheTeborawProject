import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {ToastrService} from "ngx-toastr";
import {User} from "../_models/user";
import {BehaviorSubject, take} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl
  private hubConnection?: HubConnection
  private onlineUsersSource = new BehaviorSubject<string[]>([])
  onlineUsers$ = this.onlineUsersSource.asObservable()

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory(): string | Promise<string> { return user.token }
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error => console.log(error))


    //This will wire a signal connect to the  presence hub of the api with defined method signatures speeling correct here is crit
    this.hubConnection.on('UserIsOnline', username =>{
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next([...usernames, username])
      })
      this.toastr.info(username + ' has connected')
    })

    this.hubConnection.on('UserIsOffline', username =>{
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next(usernames.filter(x=> x ! = username))
      })
      this.toastr.info(username + ' has disconnected')
    })

    this.hubConnection.on('GetOnlineUsers', usernames =>{
      this.onlineUsersSource.next(usernames)
    })

    this.hubConnection.on("NewMessageReceived", ({username,knownAs}) =>{
      this.toastr.info(knownAs + ' has sent you a new message! Click me and find out')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
        })
    })
  }

  stopHubConnection(){
    this.hubConnection?.stop().catch(error => console.log(error))
  }
}
