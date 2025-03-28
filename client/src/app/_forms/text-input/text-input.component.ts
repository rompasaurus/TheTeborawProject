import {Component, Input, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from "@angular/forms";

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent implements ControlValueAccessor{
  @Input() label = ''
  @Input() type ='text'
  //Self decorator will ensure the ngControl is unique to the inputs we are updating in the dom
  // angular bedefaul with compnents will check if it has been used recently then if it has pull it again and reuse
  // self ensures a new control is made and unique to the inputs in the dom being checked
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this
  }
  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }

  // this is a way of bypassing angulars strict mode
  //get is keyword
  get control():FormControl{
    return this.ngControl.control as FormControl
  }

}
