import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  length: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  public getOrderCode(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_code`, data)
  }
  getService(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_service_list`);
  }
  getStateslist(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_states_list`);
  }
  public getDistrictslist(data) {
    {
     return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_districts_list?district_id=${data}`)
   }
 }
 public gettaluqlist(data) {
  {
   return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_taluq_list?taluq_id=${data}`)
 }
}
public pincodeslist(data) {
  {
   return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_pincode_list?pincode_id=${data}`)
 }
}
  // public getDistrictslist(data) {
  //   if (data == "") {
  //     return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_districts_list`)
  //   }
  //    else {
  //     return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_districts_list`,data)
  //   }
  // }
  getServicelist(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_service_list_by_subcategory`);
  }
  public getServiceList(id: any):any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_service_list_by_id?id=${id}`)
  }
  public saveOrder(data: any) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/save_order`, data)
  }
  public removeFromDocumentList(data:any) {
    return this.http.post<any>(
      `${environment.BASE_SERVICE_URL}/manage_service/api/v1/delete_order_details_data`,data
    );
  }
  public saveCustomer(data:any) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/CustomerModule/`, data)
  }
  public getOrderList(data:any=""){
    {
       return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_list`)
     }
 }
 public savePayment(data:any) {
   return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Payment/`, data)
 }
 public getOrderById(id:any){
   
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_list_by_id?id=${id}`)
  
  }
public getPaymentInfo(data){
  return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/getPaymentGatwayInfo`,data)
}
public getSignatureHash(data){
  return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/getSignatureHash?data=${data}`)
}
public updatePaymentGatewayResponse(id,data){
  return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Payment/${id}/`,data)
}

public verifyPaymentRazorPay(data){
  return this.http.post<any>(`${environment.BASE_SERVICE_URL}/payment_service/api/v1/verify_payment`,data)
}

}