import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentModuleService {
  uploadImage: any;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public updatePayment(id, data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Payment/${id}/`, data)
  }
  public getPaymentList(data){
    if (data == "") {
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Payment/`)
    }
     else
      {
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Payment/${data}/`)
    }
  }
  public getPaymentverify(id){
    {
     return this.http.get<any>(`${environment.BASE_SERVICE_URL}/payment_service/api/v1/verify_payment_details?id=${id}`)
   }
   }
  public savePayment(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Payment/`, data)
  }

}
