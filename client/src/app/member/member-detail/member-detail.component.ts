import {Component, OnInit, ViewChild} from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import {DatePipe, NgIf} from "@angular/common";
import {TabDirective, TabsetComponent, TabsModule} from "ngx-bootstrap/tabs";
import {GalleryItem, GalleryModule, ImageItem} from "ng-gallery";
import {TimeagoModule} from "ngx-timeago";
import {MemberMessagesComponent} from "../member-messages/member-messages.component";
import {MessagesService} from "../../_services/messages.service";
import {Message} from "../../_models/message";

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  imports: [
    NgIf,
    TabsModule,
    GalleryModule,
    DatePipe,
    TimeagoModule,
    MemberMessagesComponent
  ],
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs?: TabsetComponent
  activeTab?: TabDirective
  member: Member | undefined;
  images: GalleryItem[] = []
  messages: Message[] = []

  //Route allows access to the username passed into the routers upon loading this component
  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessagesService){}

  ngOnInit(): void {
    this.loadMember()
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data
    if(this.activeTab.heading === 'Messages'){
      this.loadMessages()
    }
  }

  loadMessages(){
    if(this.member) {
      this.messageService.getMessageThreads(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }
  loadMember(){
    var username = this.route.snapshot.paramMap.get('username')
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member
        this.getImages();
      }
    })
  }
  getImages(){
    if(!this.member) return;
    for(const photo of this.member.photos){
      this.images.push(new ImageItem({src: photo.url, thumb:photo.url}))
    }
  }


}
