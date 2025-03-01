import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceModuleService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  public getCategoryList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Category/`, {})
  }
  public saveCategory(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Category/`, data)
  }
  public updateCategory(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Category/` + id + '/', data)
  }
  public removeFromCategory(data){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/Category/`, data)
  }
  public getSubCategoryList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/SubCategory/`, {})
  }
  public saveSubCategory(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/SubCategory/`, data)
  }
  public updateSubCategory(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/SubCategory/` + id + '/', data)
  }
  public getService() {
    
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_service_list`)
    }
  
  public deleteBranch(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/delete_Branch_fee`,data)
  }
  public deleteDocuments(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/delete_service_documents`,data)
  }
  public saveService(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/save_service`, data)
  }
  public getServiceList(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_service/api/v1/get_service_list_by_id?id=${id}`)
  }
}
