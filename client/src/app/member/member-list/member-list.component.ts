import { Component, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import {Observable, take} from "rxjs";
import {Pagination} from "../../_models/pagination";
import {response} from "express";
import {AccountService} from "../../_services/account.service";
import {UserParams} from "../../_models/userParams";
import {User} from "../../_models/user";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  //members$ : Observable<Member[]> | undefined
  members: Member[] = []
  pagination: Pagination | undefined
  userParams: UserParams | undefined
  user: User | undefined;

  constructor(private memberService:MembersService, private accountService : AccountService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          this.userParams = new UserParams(user)
          this.user = user
        }
      }
    })
  }

  ngOnInit(): void {
    //this.members$ = this.memberService.getMembers();
    this.loadMembers()
  }

  loadMembers(){
    if(!this.userParams) return
    this.memberService.getMembers(this.userParams).subscribe({
      next: response => {
        if(response.result){
          this.members = response.result
          this.pagination = response.pagination
        }
      }
    })
  }


  pageChanged($event: any) {
    if(this.userParams && this.userParams?.pageNumber != $event.page){
      this.userParams.pageNumber = $event.page
      this.loadMembers()
    }

  }
}
