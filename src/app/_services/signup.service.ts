import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Customer } from '../_models/customer.model';
import { environment } from '../../environments/environment.prod';
import { AlertService } from './alert.service';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private headers = new Headers({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'});
  private customer:Customer;
  constructor(private http: Http,private alertService:AlertService,private router: Router,) { }

  //sigup
  signup(customer:Customer){
    const url=environment.signupServiceBaseUrl+"CustomerRegistration";
    return this.http.post(url,JSON.stringify(customer),{headers:this.headers})
    .toPromise()
    .then((response) =>{JSON.stringify(response)})
    .catch(this.errorHandler)
  }

   //update customer
   updateCustomer(customer:Customer){
    const url=environment.signupServiceBaseUrl+"UpdateDetails";
    return this.http.put(url,JSON.stringify(customer),{headers:this.headers})
    .toPromise()
    .then((response) =>JSON.stringify(response))
    .catch(this.errorHandler)
  }

  //getCustomer
  getCustomerDetails(username:string):Promise<any>{
    const url=environment.signupServiceBaseUrl+"GetCustomerDetails/"+username;
    return this.http.get(url,{headers:this.headers})
    .toPromise()
    .then((response)=>{
      this.customer=response.json() as Customer,
      sessionStorage.setItem('currentUser',JSON.stringify(this.customer)),
      this.router.navigate([''])
    })
    .catch(this.errorHandler)
  }

  //disable customer
  disableCustomerDetails(username:string):Promise<any>{
    const options={
      headers:this.headers,
    }
    const url=environment.signupServiceBaseUrl+"DeactivateAccount/"+username;
    return this.http.delete(url,options)
    .toPromise()
    .then((response)=>{
      JSON.stringify(response)
    })
    .catch(this.errorHandler)
  }

  // to handle error while parsing JSON
  private errorHandler(error: any): Promise<any> {
    console.error("Error Occured:\n", JSON.parse(JSON.stringify(error))._body);
    //this.alertService.showMessage(JSON.stringify(error),"OK");
    return Promise.reject(JSON.parse(JSON.stringify(error))._body);
  }
}
