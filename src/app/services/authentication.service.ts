import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

const url = environment.API_URL;
@Injectable()
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(object) {
    const formData = { auth: object };
    return this.http.post(url + '/sign_in', formData).pipe(
      map(response => {
        if (response && response['meta']) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
      })
    );
  }
  logout() {
    this.localStorageService.resetLocalStorage();
    return this.http.delete(url + '/sign_out').pipe(
      map(response => {
        return response;
      })
    );
  }
  forgotPassword(email) {
    return this.http.post(url + '/password', { email: email });
  }
}
