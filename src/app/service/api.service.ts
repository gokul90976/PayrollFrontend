import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AppResponse } from './appResponse.modal';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;
const Personal_apiUrl = environment.PersonnelapiUrl

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  private ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
private tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  vendorDetails: any;

  constructor(private http: HttpClient) { }

  apiPutCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.put<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }
  apiPostCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.post<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }


  personel_apiPostCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = Personal_apiUrl + endPoint;
    return this.http.post<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }

  apiFormDataPostCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.post<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }

  apiDeleteCall(id: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.post<AppResponse>(finalURL, id).pipe(catchError(this.handleError));
  }

  personal_apiDeleteCall(endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.delete<AppResponse>(finalURL).pipe(catchError(this.handleError));
  }

  apiGetCall(endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.get<AppResponse>(finalURL).pipe(catchError(this.handleError));
  }

  apiGetDetailsCall(id: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.get<AppResponse>(finalURL + '/' + id).pipe(catchError(this.handleError));
  }

  calculateSpecialPF(joiningDate: Date) {
    let currentDate: Date = new Date()
    let months: any = this.monthDiff(joiningDate, currentDate)
    return months <= 148;
  }

  private monthDiff(dateFrom: Date, dateTo: Date): number {
    console.log(dateFrom, "datefrom")
    console.log(dateTo, "dateTo")

    return (dateTo.getFullYear() - dateFrom.getFullYear() * 12 + dateTo.getMonth() - dateFrom.getMonth())
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = 'Something bad happened; please try again later.';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `${error}`;
    }

    // Return an observable with a user-facing error message.
    return throwError(errorMessage);
  }

  getGradeValue(url, range: number, officeCode: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('range', range);
    params = params.append('officeCode', officeCode);
    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getDa_Value(url, currentDate: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('currentDate', currentDate);
    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getSalariesVary(url, type: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('status', type);
    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getConcessvalue(url, range: number, officeCode: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('range', range);
    params = params.append('officeCode', officeCode);
    return this.http.post<number>(API_URL + url, {}, { params });
  }
  getDaPercent(url, fromDate: any, toDate: any) {
    let params = new HttpParams();
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);

    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getDaData(url, fromDate: any, toDate: any, daDifference: any) {
    let params = new HttpParams();
    params = params.append('from', fromDate);
    params = params.append('to', toDate);
    params = params.append('daDiff', daDifference);

    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getPayslipData(url, empId: any, month: any, year: any) {
    let params = new HttpParams();
    params = params.append('employeeId', empId);
    params = params.append('month', month);
    params = params.append('year', year);

    return this.http.get<number>(API_URL + url, { params });
  }

  getReportDataByRange(fromDate: any, toDate: any) {
    let url ="aggregated"
    let params = new HttpParams();
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);

    return this.http.get<number>(API_URL + url, { params });
  }

  getPayArrearDataByRange(url, fromDate: any, toDate: any,empId:any) {
    let params = new HttpParams();
    params = params.append('employeeId', empId);
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);

    return this.http.get<number>(API_URL + url, { params });
  }

  getLastDateSplPF(url, date) {
    let params = new HttpParams();
    params = params.append('dateOfJoining', date);
    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getEmployeeId(url, date) {
    let params = new HttpParams();
    params = params.append('employeeId', date);
    return this.http.post<number>(API_URL + url, {}, { params });
  }

  sendRequest(apiName, bodyData: any, employeeId: any): Observable<any> {

    // Set the URL of your API
    const url = 'http://localhost:8080/recovery-per-month-demand';

    // Set request headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Set request parameters directly
    const params = new HttpParams().set('employeeId', employeeId);

    // Send the HTTP POST request with the request body and parameters
    return this.http.post(url, bodyData, { headers, params });
  }


  getPayArrearData(url, empId: number, voucherNo: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('employeeIds', empId);
    params = params.append('voucherNo', voucherNo);
    return this.http.post<number>(API_URL + url, {}, { params });
  }

  getDaArrearData(url, empId: number, voucherNo: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('employeeIds', empId);
    params = params.append('voucherNo', voucherNo);
    return this.http.post<number>(API_URL + url, {}, { params });
  }
  private monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];


  parseDate(dateString: string) {
    const [day, month, year] = dateString.split('/');
    const monthName = this.getMonthName(parseInt(month, 10));
    return {
      date: day,
      month: monthName,
      year: year
    };
  }



  private getMonthName(monthNumber: number): string {
    return this.monthNames[monthNumber - 1];
  }

  getDaysInCurrentMonth(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-11
    return new Date(year, month, 0).getDate();
  }

  private convertTwoDigitNumber(num: number): string {
    if (num < 20) {
      return this.ones[num];
    } else {
      return this.tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + this.ones[num % 10] : '');
    }
  }

  private convertThreeDigitNumber(num: number): string {
    if (num === 0) {
      return '';
    } else if (num < 100) {
      return this.convertTwoDigitNumber(num);
    } else {
      return this.ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + this.convertTwoDigitNumber(num % 100) : '');
    }
  }

  numberToWords(num: number): string {
    if (num === 0) {
      return 'zero';
    }

    const lakh = Math.floor(num / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const remainder = num % 100;

    let result = '';
    if (lakh > 0) {
      result += this.ones[lakh] + ' lakh ';
    }
    if (thousand > 0) {
      result += this.convertTwoDigitNumber(thousand) + ' thousand ';
    }
    if (hundred > 0) {
      result += this.ones[hundred] + ' hundred ';
    }
    if (remainder > 0) {
      result += 'and ' + this.convertTwoDigitNumber(remainder);
    }

    return result.trim() + ' only';
  }

  capitalizeFirstLetters(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  
}

