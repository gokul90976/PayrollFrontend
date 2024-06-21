import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = sessionStorage.getItem('token');
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: currentUser
                }
            });
        }
        return next.handle(request);
    }
}
// sessionStorage.setItem('token', 'Bearer ' + data.token);
