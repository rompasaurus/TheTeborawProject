// import { HttpInterceptorFn } from '@angular/common/http';
//
// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {NavigationExtras, Router} from "@angular/router";
import {catchError, Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private router: Router, private toastr: ToastrService) {
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse)=> {
        if (error) {
          switch (error.status) {
            case 400:
              // multipl errors could be passed back this will check if a object was passed that needs iterated through
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                //this will take wat was two array objects and flatten them into one
                //throw modelStateErrors.flat();
                throw modelStateErrors.flat();
              } else {
                this.toastr.error(error.error, error.status.toString())
              }
              break;
            case 401:
              this.toastr.error('Unauthorized', error.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/not-found')
              break;
            case 500:
              //Navigation extras provides a way to pass the error information into a component to display it on the page
              const navigationExtras: NavigationExtras = {state: {error: error.error}}
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected occurred');
              console.log(error);
              break;
          }
        }
        throw error;
      }));
    }
}
