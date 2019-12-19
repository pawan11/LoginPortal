import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { environment } from '../../environments/environment.prod';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class CheckConnectionService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http,private alertService:AlertService) { }

  checkLoginConnection(){
    const url =environment.loginServiceBaseUrl+"checkConnection";
    return this.http.get(url,{headers:this.headers})
    .toPromise()
    .then((response) =>response)
    .catch(this.errorHandler)
  }
  
  checkSignupConnection(){
    const url =environment.signupServiceBaseUrl+"checkConnection";
    return this.http.get(url,{headers:this.headers})
    .toPromise()
    .then((response) =>response)
    .catch(this.errorHandler)
  }

  errorHandler(error: any): Promise<any> {
    console.error("Error Occured:\n", error.status);
    //this.alertService.showMessage(JSON.stringify(error),"OK");
    return Promise.reject(error.status);
  }
}
