import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { LoadingService} from './../loading.service'
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
      private cookieService: CookieService,private router: Router,
      private _loading: LoadingService
      ){}

    private handleError(err: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            localStorage.clear();
            console.log('clear');
            this.router.navigateByUrl(`/Login`);
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            return of(err.message); // or EMPTY may be appropriate here
        }
        return throwError(err);
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = localStorage.getItem('user_id');
        const token = localStorage.getItem('accessToken');
        this._loading.setLoading(true, request.url);
        console.log("access");
        if (currentUser && token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
              this._loading.setLoading(false, request.url);
              if (err.status === 401) {
                localStorage.clear();
                // this.router.navigate(['Login'], { queryParams: { returnUrl: this.router.url } });
                this.router.navigateByUrl(`/Login`);
                return throwError(err.error.detail);
              }else if (err.status === 0) {
                return throwError('Unable to Connect to the Server');
              }else if (err.status === 400) {
                return throwError(JSON.stringify(err.error));
              }else{
                console.log(err)
                return throwError(err.error);
              }

            })
            
        )
        .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            this._loading.setLoading(false, request.url);
          }
          return evt;
        }));
    }
}
