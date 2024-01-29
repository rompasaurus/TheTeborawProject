import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BusyService} from "../_services/busy.service";
import {delay, finalize, Observable} from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor{

  constructor(private busyService: BusyService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.busyService.busy();
    return next.handle(req).pipe(
      //this is a synthetic delay for development to allow for loading bar to show itself
      delay(1000),
      finalize(()=> {
        this.busyService.idle()
      })
    )
  }
}

