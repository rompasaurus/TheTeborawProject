import {Component, OnInit} from '@angular/core';
import {Message} from "../_models/message";
import {Pagination} from "../_models/pagination";
import {MessagesService} from "../_services/messages.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages? : Message[]
  pagination?: Pagination
  container = 'Unread'
  pageNumber = 1
  pageSize = 5
  loading = false

  constructor(private messageService: MessagesService) {
  }
  ngOnInit(): void {
      this.loadMessage()
  }

  loadMessage(){
    this.loading = true
    this.messageService.getMessages(this.pageNumber,this.pageSize,this.container).subscribe({
      next: response => {
        this.messages = response.result
        this.pagination = response.pagination
        this.loading = false;
      }
    })
  }

  deleteMessage(id:number){
    this.messageService.deleteMessage(id).subscribe({
      next: ()=> this.messages?.splice(this.messages?.findIndex(m=>m.id === id),1)
    })
  }

  pageChanged(event: any) {
    if(this.pageNumber != event.page){
      this.pageNumber = event.page
      this.loadMessage()
    }
  }

}
