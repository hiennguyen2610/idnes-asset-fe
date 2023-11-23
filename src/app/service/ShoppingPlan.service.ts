import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingPlan } from '../domain/ShoppingPlan';
import { Page } from '../domain/pageable';

@Injectable({
  providedIn: 'root',
})
export class ShoppingPlanService {
  constructor(private http: HttpClient) { }

  private baseURL = 'http://localhost:8080/api/v1/shopping-plan';

  authToken = localStorage.getItem('jwtToken');

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.authToken}`,
  });

  getAllShoppingPlans(index: any): Observable<ShoppingPlan[]> {
    return this.http.get<ShoppingPlan[]>(this.baseURL + '/get-all-shopping-plan-not-pageable?index=' + index, {
      headers: this.headers,
    });
  }

  // Gọi tới api lấy danh sách sp
  getShoppingPlanList(
    page: number,
    size: number
  ): Observable<Page<ShoppingPlan>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const options = { params, headers: this.headers };

    return this.http.get<Page<ShoppingPlan>>(
      `${this.baseURL}/get-all-shopping-plan`,
      options
    );
  }

  // Xóa sp
  deleteShoppingPlan(id: number): Observable<Object> {
    return this.http.delete(`${this.baseURL}/delete-shopping-plan/${id}`, {
      headers: this.headers,
    });
  }

  // Chuyển sang tài sản
  changeProductStatusToPending(id: number): Observable<Object> {
    return this.http.post(
      `${this.baseURL}/change-product-status-to-pending?id=${id}&status=Chờ phê duyệt`,
      { headers: this.headers }
    );
  }

  // ADMIN phê duyệt
  changeProductStatusToApproved(id: number): Observable<Object> {
    return this.http.post(
      `${this.baseURL}/change-product-status-to-approved?id=${id}&status=Đã phê duyệt`,
      { headers: this.headers }
    );
  }

  // ADMIN cancelled
  changeProductStatusToCancelled(id: number): Observable<Object> {
    return this.http.post(
      `${this.baseURL}/change-product-status-to-cancelled?id=${id}&status=Đã hủy`,
      { headers: this.headers }
    );
  }

  changeProductStatusToDoneAndAddToAssetList(
    id: number,
    data: any
  ): Observable<Object> {
    return this.http.post(
      `${this.baseURL}/change-product-status-to-done?id=${id}&status=Đã xong`,
      data,
      { headers: this.headers }
    );
  }

  // Search by product name
  searchByProductName(productName: string): Observable<Page<ShoppingPlan>> {
    return this.http.get<Page<ShoppingPlan>>(
      this.baseURL + '/search-by-product-name?productName=' + productName, {
      headers: this.headers,
    });
  }


  advancedSearch(productName: string, planList: number, planListDetail: number, productType: number, productTypeDetail: number, unit: number, currency: number): Observable<Page<ShoppingPlan>> {
    return this.http.get<Page<ShoppingPlan>>(this.baseURL + '/search?productName=' + productName + '&planListId=' + planList + '&planListDetailId=' + planListDetail + '&productTypeId=' + productType + '&productTypeDetailId=' + productTypeDetail + '&unitId=' + unit + '&currencyId=' + currency);
  }


  createShoppingPlan(data: any): Observable<Object> {
    return this.http.post(`${this.baseURL}/create-shopping-plan`, data, {
      headers: this.headers,
    });
  }

  updateShoppingPlan(id: number, shoppingPlan: any): Observable<Object> {
    return this.http.put(
      `${this.baseURL}/update-shopping-plan/${id}`,
      shoppingPlan,
      { headers: this.headers }
    );
  }

  getShoppingPlan(id: number) {
    return this.http.get(`${this.baseURL}/get-shopping-plan/${id}`, {
      headers: this.headers,
    });
  }

  getShoppingPlanByPlanListDetail(
    page: number,
    size: number,
    id: number
  ): Observable<Page<ShoppingPlan>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const options = { params, headers: this.headers };

    return this.http.get<Page<ShoppingPlan>>(
      `${this.baseURL}/get-shopping-plan-by-plan-list-detail?idPlanListDetail=${id}`,options);
  }

  getAllVersionByShoppingPlan(id: number) {
    return this.http.get(`${this.baseURL}/get-versions-by-shopping-plan-id/${id}`, {headers: this.headers});
  }

  getShoppingPlanUpdatedHistoryByVersion(id: number, version: string) {
    return this.http.get(`${this.baseURL}/get-shopping-plan-updated-history/id/${id}/version/${version}`, {
      headers: this.headers
    });
  }

}
