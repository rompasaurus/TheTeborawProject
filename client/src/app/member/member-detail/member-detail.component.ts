import {Component, OnInit, ViewChild} from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {TabDirective, TabsetComponent, TabsModule} from "ngx-bootstrap/tabs";
import {GalleryItem, GalleryModule, ImageItem} from "ng-gallery";
import {TimeagoModule} from "ngx-timeago";
import {MemberMessagesComponent} from "../member-messages/member-messages.component";
import {MessagesService} from "../../_services/messages.service";
import {Message} from "../../_models/message";
import {PresenceService} from "../../_services/presence.service";

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
    MemberMessagesComponent,
    AsyncPipe
  ],
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent
  activeTab?: TabDirective
  member: Member = {} as Member
  images: GalleryItem[] = []
  messages: Message[] = []

  //Route allows access to the username passed into the routers upon loading this component
  constructor(private memberService: MembersService, private route: ActivatedRoute,
              private messageService: MessagesService,public presenceService: PresenceService){}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })
    //WARNING YOU DONT HAVE ACCESS TO THE MEMBER TABS ON INTIALIZE OR ANY CHILD COMPONENT
    this.route.queryParams.subscribe({
      next: params =>{
        params['tab'] && this.selectTab(params['tab'])
      }
    })
    this.getImages()
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data
    if(this.activeTab.heading === 'Messages'){
      this.loadMessages()
    }
  }

  selectTab(heading : string){
    if(this.memberTabs){
      //the ! tells ts to stop checking cuz we're going rouge and shit about to get wierd
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true
    }
  }

  loadMessages(){
    if(this.member) {
      this.messageService.getMessageThreads(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }
  getImages(){
    if(!this.member) return;
    for(const photo of this.member.photos){
      this.images.push(new ImageItem({src: photo.url, thumb:photo.url}))
    }
  }


}
