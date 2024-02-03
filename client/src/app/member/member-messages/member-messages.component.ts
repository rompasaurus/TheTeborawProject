import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../_models/message";
import {MessagesService} from "../../_services/messages.service";
import {NgForOf, NgIf} from "@angular/common";
import {TimeagoModule} from "ngx-timeago";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TimeagoModule
  ],
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @Input() messages:Message[] = []
  @Input() username? : string

  constructor() {
  }
  ngOnInit(): void {
  }



  protected readonly Date = Date;
}
