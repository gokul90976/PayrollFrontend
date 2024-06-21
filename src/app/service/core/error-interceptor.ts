import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    response!: Observable<any>;
    constructor( private router: Router, ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(catchError(err => {
            if (err.error) {
                if (err.error.message && err.error.message !== 'No message available' && err.error.message !== 'Unauthorized'
                    && !err.error.message.includes('No grid list available')
                    && !err.error.message.includes('could not execute statement')
                    && !err.error.message.includes('SQLGrammarException')
                    && !err.error.message.includes('Internal error occured')
                    && !(err.error.errorMessage && !err.error.errorMessage.includes('BadCredentialsException: Bad credentials')
                        && !err.error.errorMessage.includes('NullPointerException:')
                        && !err.error.errorMessage.includes('IncorrectResultSizeDataAccessException:'))) {
                }
            }
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                // sessionStorage.removeItem('token');
                // this.authenticationService.logout();
                // if (this.router.url !== '/login') {
                //     // tslint:disable-next-line: deprecation
                //     location.reload();
                // }
                this.router.navigate(['/login']);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
