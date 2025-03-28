import {Component, Input, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from "@angular/forms";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements ControlValueAccessor{
  @Input() label = ''
  @Input() maxDate: Date | undefined;
  bsConfig: Partial<BsDatepickerModule> | undefined
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this
    this.bsConfig = {
      containerClass : 'theme-red',
      dateInputFormat: 'DD MMMM YYYY'
    }
  }
  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }

  get control():FormControl {
    return this.ngControl.control as FormControl
  }

}
