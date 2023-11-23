import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Asset } from "../domain/asset";
import { Page } from "../domain/pageable";

@Injectable({
    providedIn: "root",
  })
export class AssetService {
    private baseURL = "http://localhost:8080/api/v1/asset";
  
  authToken = localStorage.getItem('jwtToken');

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.authToken}`,
  });
  
    // getAssetList(): Observable<Asset[]>{
    //   return this.http.get<Asset[]>(`${this.baseURL}/get-all-asset`, {headers: this.headers});
    // }
    
    getAssetList(page: number, size: number): Observable<Page<Asset>> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    
      const options = { params, headers: this.headers };
    
      return this.http.get<Page<Asset>>('http://localhost:8080/api/v1/asset/get-all-asset', options);
    }

    constructor(private http: HttpClient,
      ) { }
  
    createAsset(newAssetData: Asset): Observable<Object>{
      return this.http.post(`${this.baseURL}/create-asset`, newAssetData, {headers: this.headers});
    }

    deleteAsset(id: number): Observable<Object>{
      return this.http.delete(`${this.baseURL}/delete-asset/${id}`, {headers: this.headers});
    }

    getAssetById(id: number): Observable<Asset>{
      return this.http.get<Asset>(`${this.baseURL}/asset/${id}`, {headers: this.headers});
    }
  
    updateAsset(id: number, asset: Asset): Observable<Object>{
      return this.http.put(`${this.baseURL}/update-asset/${id}`, asset, {headers: this.headers});
    }
    
    getAssetIdByShoppingPlanId(id: number): Observable<Object>{
      return this.http.get(`${this.baseURL}/get-asset-id-by-shopping-plan-id/${id}`, {headers: this.headers});
    }
  }