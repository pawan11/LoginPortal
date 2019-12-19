import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Customer } from '../_models/customer.model';
import { SignupService } from './signup.service';
import { environment } from '../../environments/environment.prod';
import { AlertService } from './alert.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'});
  private customer:Customer;
  constructor(private http: Http,private signupService:SignupService,private alertService:AlertService) { }

  //login
  login(username:string,password:string):Promise<any>{
    //console.log(JSON.stringify({username,password}));
    const url=environment.loginServiceBaseUrl+"login";
    return this.http.post(url,JSON.stringify({username,password}),{headers:this.headers})
    .toPromise()
    .then(response =>{
      JSON.stringify(response)
    })
    .catch(this.errorHandler)
  }

  //logout
  logout(){
      sessionStorage.removeItem('currentUser');
  }

  // to handle error while parsing JSON
  private errorHandler(error: any): Promise<any> {
    console.error("Error Occured:\n", JSON.parse(JSON.stringify(error))._body);
    //this.alertService.showMessage(JSON.stringify(error),"OK");
    return Promise.reject(JSON.parse(JSON.stringify(error))._body);
  }
}
