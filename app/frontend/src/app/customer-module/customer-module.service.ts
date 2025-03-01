import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomerModuleService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  public saveCustomer(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/CustomerModule/`, data)
  }
  public getCustomerList(data) {
    if (data == "") {
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/CustomerModule/`)
    }
     else {
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/CustomerModule/${data}/`)
    }
  }
  public updateCustomer(id, data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/CustomerModule/${id}/`, data)
  }
}
