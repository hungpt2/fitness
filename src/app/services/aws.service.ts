import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
const url = environment.API_URL;

@Injectable()
export class AWSService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}
  getSignature() {
    return this.http.get(url + '/users/s3_signature').pipe(
      map(response => {
        return response;
      })
    );
  }
  uploadImage(files, userId) {
    return new Promise((resolve, reject) => {
      this.getSignature().subscribe(
        response => {
          const imageFile = files[0];
          const data: any = response;
          const { policy, signature, key, bucket } = data;
          const formData: FormData = new FormData();
          const urlImage = `users/${userId}/${imageFile.name}`;
          formData.append('key', urlImage);
          formData.append('AWSAccessKeyId', key);
          formData.append('policy', policy);
          formData.append('signature', signature);
          formData.append('acl', 'public-read');
          formData.append('Content-Type', imageFile.type || 'image/jpeg');
          formData.append('file', imageFile);
          this.http
            .post(`https://${bucket}.s3.amazonaws.com/`, formData)
            .subscribe(
              dataUpload => {
                resolve(`https://${bucket}.s3.amazonaws.com/` + urlImage);
              },
              error => reject(JSON.stringify(error))
            );
        },
        error => reject(JSON.stringify(error))
      );
    });
  }
  uploadImageBase64(base64, userId) {
    return new Promise((resolve, reject) => {
      this.getSignature().subscribe(
        response => {
          const data: any = response;
          const { policy, signature, key, bucket } = data;
          const formData: FormData = new FormData();
          const urlImage = `users/${userId}/${Date.now()}.jpg`;
          formData.append('key', urlImage);
          formData.append('AWSAccessKeyId', key);
          formData.append('policy', policy);
          formData.append('signature', signature);
          formData.append('acl', 'public-read');
          formData.append('Content-Type', 'image/jpeg');
          const byteCharacters = atob(
            base64.replace('data:image/jpeg;base64,', '')
          );
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'data:image/jpeg' });
          formData.append('file', blob);
          this.http
            .post(`https://${bucket}.s3.amazonaws.com/`, formData)
            .subscribe(
              dataUpload => {
                resolve(`https://${bucket}.s3.amazonaws.com/` + urlImage);
              },
              error => reject(JSON.stringify(error))
            );
        },
        error => reject(JSON.stringify(error))
      );
    });
  }
}
