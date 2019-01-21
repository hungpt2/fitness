import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const url = environment.API_URL;

@Injectable()
export class TipsService {
  constructor(private http: HttpClient) {}
  getTips(week = 1) {
    return this.http.get(url + `/articles?week=${week}`).pipe(
      map(response => {
        return response;
      })
    );
  }
  getTip(id) {
    return this.http.get(url + '/articles/' + id).pipe(
      map(response => {
        return response;
      })
    );
  }
}
