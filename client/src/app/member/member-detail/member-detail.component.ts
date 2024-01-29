import { Component, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import {NgIf} from "@angular/common";
import {TabsModule} from "ngx-bootstrap/tabs";
import {GalleryItem, GalleryModule, ImageItem} from "ng-gallery";

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  imports: [
    NgIf,
    TabsModule,
    GalleryModule
  ],
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  images: GalleryItem[] = []

  //Route allows access to the the username passed into the routers upon loading this component
  constructor(private memberService: MembersService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.loadMember()
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
