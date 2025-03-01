import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderModuleService {
  uploadImage: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  public removeFromDocumentList(data) {
    return this.http.post<any>(
      `${environment.BASE_SERVICE_URL}/manage_service/api/v1/delete_order_details_data`,data
    );
  }
  public saveOrderStatus(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/OrderStatus/`, data)
  }        
  public getOrderCode(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_code`, data)
  }
  public getOrderList(data){
    if (data == "") {
        return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_list`)
      }
  }
  public saveOrder(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/save_order`, data)
  }
  public getOrderById(id){
   {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_list_by_id?id=${id}`)
  }
  }
  public orderStatusList(data) {
    {
     return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_order_status?order_id=${data}`)
   }
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
}
