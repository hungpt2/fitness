import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const url = environment.API_URL;
@Injectable()
export class ProgressService {
  private progressUrl = 'api/progress';
  private progressData: any = null;
  private _formData: any = {};
  constructor(private http: HttpClient) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  create(
    week: number,
    week_s: number,
    weight: number,
    weight_s: number,
    title: string,
    tags: string,
    photo1: string,
    photo2: string,
    ins: boolean,
    fb: boolean
  ) {}

  delete(id: number) {}
  saveProgresData(data) {
    this._formData = data;
  }
  getProgresData() {
    return this._formData;
  }
  resetProgresData() {
    this._formData = {};
  }
  postProgres(formData) {
    return this.http.post(url + '/posts', formData);
  }
  getProgres() {
    return this.http.get(url + '/posts/my_progress').pipe(
      map(response => {
        const data: any = response;
        this.progressData = data.posts || [];
        return this.progressData;
      })
    );
  }
  deleteProgres(id) {
    return this.http.delete(url + '/posts/' + id);
  }

  getProgressListData() {
    return this.progressData;
  }
  editProgress(formData, id) {
    return this.http.put(url + '/posts/' + id, formData);
  }
}
