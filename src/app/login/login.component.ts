import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { Router } from '../../../node_modules/@angular/router';
import { FormControl,FormBuilder,FormGroup } from '../../../node_modules/@angular/forms';
import { Validators } from '../../../node_modules/@angular/forms';
import { Customer } from '../_models/customer.model';
import { LoginService } from '../_services/login.service';
import { AlertService } from '../_services/alert.service';
import { CheckConnectionService } from '../_services/check-connection.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { SignupValidator } from '../_validations/Signup.validator';
import { SignupService } from '../_services/signup.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  customer:Customer;
  returnUrl: string;
  error='';
  connectionFlag:boolean=false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService:LoginService,
    private alertService:AlertService,
    private connectionService:CheckConnectionService,
    private _snackBar: MatSnackBar,
    private signupService:SignupService) { }

  ngOnInit() {
    //reset Login Status
    this.loginService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.checkConnection();
  }

  checkConnection(){
    this.connectionService.checkLoginConnection()
    .then(response => {this.initializeForm(),this.connectionFlag=true})
    .catch(error=>this.openConnectionSnackBar("Connection Error","Reload"))
  }

  openConnectionSnackBar(message: string, action: string) {
    let snackBarRef=this._snackBar.open(message, action, {
      duration: 10000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.checkConnection();
    }); 
  }


  initializeForm(){
    this.loginForm=new FormGroup({
      username:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required,SignupValidator.validatePassword])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login(){
    this.loginService.login(this.f.username.value,this.f.password.value)
    .then(response=>{
      this.signupService.getCustomerDetails(this.f.username.value),
      this.alertService.showMessage("Successfully Logged In!","OK"),
      this.router.navigate([this.returnUrl])
    })
    .catch(error=>{
      this.alertService.showMessage(error,"OK");
    })
    
  }

  signup(){
    this.router.navigate(['/signup']);
  }
}
