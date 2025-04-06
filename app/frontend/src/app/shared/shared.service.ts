import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  a = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ];
  b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  loginUser(userInfo): Observable<any> {
    return this.http
      .post<any>(
        `${environment.BASE_SERVICE_URL}/authentication/api/token/`,
        userInfo
      )
      .pipe(
        map((user) => {
          this.userSubject.next(user);
          this.cookie.set('isLoggedIn', 'true');
          // this.cookie.set('access_token',user.access);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  checkLogin(): any {
    if (this.cookie.get('isLoggedIn') && this.cookie.get('access_token')) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/Login']);
    this.cookie.deleteAll();
    localStorage.clear();
  }

  refreshToken(): any {
    return this.http.post<any>(
      `${environment.BASE_SERVICE_URL}/authentication/api/token/refresh/`,
      {}
    );
  }

  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    const timeout = Date.now() + 10 * 60 * 1000 - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  public getBranchList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_branch/api/v1/BranchUser/?query=`,
      {}
    );
  }

  public getBranchs() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Branch/`
    );
  }

  public getDepartmentList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Department/`
    );
  }
  public getUserPermissionList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/authentication/api/get_permissions`
    );
  }

  public getDepartmentDetails(id) {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Department/` +
        id +
        '/'
    );
  }

  public saveDepartment(data) {
    return this.http.post<any>(
      `${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Department/`,
      data
    );
  }

  public updateDepartment(data, id) {
    return this.http.put<any>(
      `${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Department/` +
        id +
        '/',
      data
    );
  }

  GetPDF(data: any): any {
    let headers = new Headers();
    const url = `${environment.BASE_SERVICE_URL}/report_service_pdf` + data;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((res) => {
        return new Blob([res], { type: 'application/pdf' });
        // res;
      })
    );
  }
  GetXLS(data: any): any {
    let headers = new Headers();
    const url =
      `${environment.BASE_SERVICE_URL}/ecom/api/v1/get_invoice_pdf?order_number=` +
      data;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((res) => {
        return new Blob([res], { type: 'application/xlsx' });
        // res;
      })
    );
  }

  amountInWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    let n: any = ('000000000' + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str +=
      n[1] != 0
        ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) +
          'crore '
        : '';
    str +=
      n[2] != 0
        ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) +
          'lakh '
        : '';
    str +=
      n[3] != 0
        ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) +
          'thousand '
        : '';
    str +=
      n[4] != 0
        ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) +
          'hundred '
        : '';
    str +=
      n[5] != 0
        ? (str != '' ? 'and ' : '') +
          (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]])
        : '';
    return str + ' only';
  }
  public getAppSettings() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_report/api/v1/AppSettings/`
    );
  }
  public getReports() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_report/api/v1/ReportModule/`
    );
  }
  // Dashboard API's
  public getDashboardPOList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_po_list`
    );
  }

  public getDashboardGrnList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_grn_list`
    );
  }
  public getDashboardSalesList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_monthly_sales_list`
    );
  }
  public getDashboardPurchaseList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_monthly_purchase_list`
    );
  }
  public getDashboardExpenseList() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_monthly_expense_list`
    );
  }
  public getReportsNew() {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_reportengine/api/v1/ReportEngineMain/`
    );
  }
  // [NEW] Report Engine
  public getReportbyIDAndType(id, from_date, to_date, filter_data) {
    return this.http.get<any>(
      `${environment.BASE_SERVICE_URL}/manage_reportengine/api/v1/get_report?id=${id}&from_date=${from_date}&to_date=${to_date}&filter=${filter_data}`
    );
  }
}
