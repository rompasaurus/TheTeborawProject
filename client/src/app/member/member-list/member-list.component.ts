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
  genderList = [
    {value: 'male',display: 'Males'}, 
    {value: 'female',display: 'Females'},
    {value: 'all',display: 'All'},
    {value: 'other',display: 'Other'}
  ]
  constructor(private memberService:MembersService){
    this.userParams = this.memberService.getUserParams()
  }

  ngOnInit(): void {
    //this.members$ = this.memberService.getMembers();
    this.loadMembers()
  }

  loadMembers(){
    if(this.userParams){
      this.memberService.setUserParams(this.userParams)
      console.log("About to load members with params: ",this.userParams)
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if(response.result){
            this.members = response.result
            this.pagination = response.pagination
          }
        }
      })
    }
  }

  pageChanged(event: any) {
    if(this.userParams && this.userParams?.pageNumber != event.page){
      this.userParams.pageNumber = event.page
      this.memberService.setUserParams(this.userParams)
      this.loadMembers()
    }
  }

  resetFilter(){
    this.userParams = this.memberService.resetUserParams()
    this.loadMembers();
  }
}
