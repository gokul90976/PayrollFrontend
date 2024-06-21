import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiHttp = 'http://localhost:8080/api/getAllEmployeePayRoll/payrolls/json'

  http: HttpClient = inject(HttpClient);

  postApiMethod(data : any): Observable<any>{
    return this.http.post(this.apiHttp,data);
  }
}
