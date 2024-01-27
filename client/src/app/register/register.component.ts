import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  model: any ={}
  constructor(private accountService: AccountService, private toastr: ToastrService){}

  register() {
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log("registration complete",response);
        this.cancel();
      },
      //error: error => this.toastr.error(error.error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}

