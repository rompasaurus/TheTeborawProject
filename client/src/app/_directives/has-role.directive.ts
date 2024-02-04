import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {User} from "../_models/user";
import {AccountService} from "../_services/account.service";
import {take} from "rxjs";


//This directive will work similarly to the ngIf directive but in this case taking in array of string roles
//the ngonit with determin if the user has one of the directives roles witl will then display the html child compoentent
// the viewaContainerRef if the role exist else it will clear the container compoent showing notihing on the dom at all
@Directive({
  selector: '[appHasRole]' // *appHasRole='['Admin,"Thing']"
})
export class HasRoleDirective  implements OnInit{
  @Input() appHasRole: string[] =[]
  user : User = {} as User
  constructor(private  viewaContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>,
              private  accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user
      }
    })
  }

  ngOnInit(): void {
      if(this.user.roles.some(r => this.appHasRole.includes(r))){
        this.viewaContainerRef.createEmbeddedView(this.templateRef)
      }else {
        this.viewaContainerRef.clear()
      }
  }

}
