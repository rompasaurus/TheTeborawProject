import { Injectable } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {initialState} from "ngx-bootstrap/timepicker/reducer/timepicker.reducer";
import {ConfirmDialogComponent} from "../modals/confirm-dialog/confirm-dialog.component";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef? : BsModalRef<ConfirmDialogComponent>
  constructor(private modalService : BsModalService) { }

  confirm(
    title = 'Confirmation',
    message = 'You Fucking sure bout this?!?',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent,config)
    return this.bsModalRef.onHidden!.pipe(
      map(() => {
        return this.bsModalRef!.content!.result
      })
    )
  }

}
