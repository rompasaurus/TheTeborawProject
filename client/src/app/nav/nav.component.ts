import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { response } from 'express';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  model : any = {}
  loggedIn  = false;

  constructor(private accoutService: AccountService){}

  ngOnInit(): void {
    
  }

  login(){
    this.accoutService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.loggedIn = true;
      },
      error: error => {
        console.log(error)
      }
    })
  }

  logout(){
    this.loggedIn = false;
  }
}
