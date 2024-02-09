import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BusyService} from "../_services/busy.service";
import {delay, finalize, identity, Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor{

  constructor(private busyService: BusyService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.busyService.busy();
    return next.handle(req).pipe(
      //this is a synthetic delay for development to allow for loading bar to show itself
      //Identity does nothing but cant have a null fn call
      (environment.prodution ? identity : delay(1000)),
      finalize(()=> {
        this.busyService.idle()
      })
    )
  }
}

