import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  private authenticationObs$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private router: Router,
    // private cookie: CookieService,
    private http: HttpClient
  ) { 

    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
  }
  handleError(error: HttpErrorResponse){
    return (error.message || "Incorrect in username or password")
   };
  SaveContactUs(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/contact_us/`,data);
  }
  getAuthenticationObs(): Observable<boolean> {
    return this.authenticationObs$.asObservable();
  }
  setAuthenticationObs(isAuthenticated: boolean) {
    this.authenticationObs$.next(isAuthenticated);
  }

  registerUser(registerInfo: any): Observable<any>{
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/user/`, registerInfo)
  };

  loginUser(userInfo: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/token/`, userInfo);
  }

  logoutUser() {
 
    this.userSubject.next(null);
    this.router.navigate(['/']);
    localStorage.clear();
  }
}
