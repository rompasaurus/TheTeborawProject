import { ResolveFn } from '@angular/router';
import {Member} from "../_models/member";
import {inject} from "@angular/core";
import {MembersService} from "../_services/members.service";

export const memberDetailResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MembersService)
  //override the get call with ! cuz I live on the edge pretty sure there should be a username
  return memberService.getMember(route.paramMap.get('username')!)
};
