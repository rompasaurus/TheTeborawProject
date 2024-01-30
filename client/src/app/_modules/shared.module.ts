import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxSpinnerModule } from "ngx-spinner";
import {FileUploadModule} from "ng2-file-upload";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgxSpinnerModule.forRoot({
      type: 'square-spin'
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    FileUploadModule
  ],
  exports:[
    TooltipModule,
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxSpinnerModule,
    FileUploadModule
  ]
})
export class SharedModule { }
