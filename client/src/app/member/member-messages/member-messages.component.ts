import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../_models/message";
import {MessagesService} from "../../_services/messages.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @Input() username? : string
  messages :Message[] = []

  constructor(private messageService: MessagesService) {
  }
  ngOnInit(): void {
    this.loadMessages()
  }

  loadMessages(){
    if(this.username) {
      this.messageService.getMessageThreads(this.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }
}
