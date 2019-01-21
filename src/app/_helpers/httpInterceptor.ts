import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  constructor(
    public router: Router,
    private localStorage: LocalStorageService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes('s3.amazonaws.com') ||
      req.url.includes('laurensimpsonfitness.com')
    ) {
      return next.handle(req);
    }
    const authReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.localStorage.getToken(),
        'Content-Type': 'application/json'
      }
    });
    return next.handle(authReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              localStorage.removeItem('currentUser');
              this.router.navigateByUrl('/login');
            }
          }
        }
      )
    );
  }
}
