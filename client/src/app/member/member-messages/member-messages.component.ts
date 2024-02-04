import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../_models/message";
import {MessagesService} from "../../_services/messages.service";
import {NgForOf, NgIf} from "@angular/common";
import {TimeagoModule} from "ngx-timeago";
import {FormsModule, NgForm} from "@angular/forms";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TimeagoModule,
    FormsModule
  ],
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @Input() messages:Message[] = []
  @Input() username? : string
  @ViewChild('messageForm') messageForm? : NgForm
  messageContent = ''

  constructor(private messagesService: MessagesService) {
  }
  ngOnInit(): void {
  }

  sendMessage(){
    if(!this.username) return
    this.messagesService.sendMessage(this.username, this.messageContent).subscribe({
      next: message => {
        this.messages.push(message)
        this.messageForm?.reset()
      }
    })
  }

}
