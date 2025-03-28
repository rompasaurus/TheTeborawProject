import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import {Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup<any>({})
  maxDate : Date = new Date()
  validationErrors: string[] | undefined
  constructor(private accountService: AccountService, private toastr: ToastrService, private fb : FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.initializeFrom()
    this.maxDate.setFullYear(this.maxDate.getUTCFullYear() -18)
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value)
    const values = {...this.registerForm.value, dateOfBirth: dob}
    console.log("values: ", values)
    this.accountService.register(values).subscribe({
      next: response => {
        console.log("registration complete",response);
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error
      }
    })
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

  private getDateOnly(dob : string | undefined){
    if(!dob) return
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset()))
      .toISOString().slice(0,10)
  }

}

