import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  model: any ={}
  registerForm: FormGroup = new FormGroup<any>({})
  maxDate : Date = new Date()
  constructor(private accountService: AccountService, private toastr: ToastrService, private fb : FormBuilder){}

  ngOnInit(): void {
    this.initializeFrom()
    this.maxDate.setFullYear(this.maxDate.getUTCFullYear() -18)
  }

  register() {
    // this.accountService.register(this.model).subscribe({
    //   next: response => {
    //     console.log("registration complete",response);
    //     this.cancel();
    //   },
    //   //error: error => this.toastr.error(error.error)
    // })
    console.log(this.registerForm?.value)
  }

  initializeFrom(){
    this.registerForm = this.fb.group({
      gender:           ['male'],
      username:         ['', Validators.required],
      knownAs:          ['', Validators.required],
      dateOfBirth:      ['', Validators.required],
      city:             ['', Validators.required],
      country:          ['', Validators.required],
      password:         ['',[Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      confirmPassword:  ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string) : ValidatorFn{
    return(control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching : true}
    }
  }
  cancel(){
    this.cancelRegister.emit(false)
  }


}

