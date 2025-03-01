import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  public saveBranch(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Branch/`, data)
  }
  public getBranch(data) {
    if (data == "") {
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Branch/`)
    } else {
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Branch/${data}/`)
    }
  }
  public updateBranch(id, data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/Branch/${id}/`, data)
  }
  public getBranchShipLocations(data) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/BranchShip?branch_id=${data}`)
  }
  public saveBranchShipLocations(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/BranchShip/`, data)
  }
  public updateBranchShipLocations(id, data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/BranchShip/${id}/`, data)
  }
  public deleteBranchShipLocations(id) {
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/BranchShip/${id}/`)
  }
  public getProductCampaigns() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_branch/api/v1/ProductCampaign`)
  }
}
