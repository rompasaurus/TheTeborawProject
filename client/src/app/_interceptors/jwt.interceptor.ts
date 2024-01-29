import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { Injectable } from '@angular/core';


@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private accountService: AccountService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //THis is a trick to ensure that the subscription completes and unsubscribing is not required 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          req = req.clone({
            setHeaders: {
              //back ticks allow for string interpols to be added inline without need of + '' nonsense
              Authorization: `Bearer ${user.token}`
            }
          })
        }
      }
    })
    return next.handle(req)
  }
}

