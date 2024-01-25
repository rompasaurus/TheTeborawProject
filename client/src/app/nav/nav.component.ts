import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class NavComponent implements OnInit {
  model : any = {}
  constructor(public accountService: AccountService){}

  ngOnInit(): void {
  }


  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error)
      }
    })
  }

  logout(){
    this.accountService.logout();
  }
}
