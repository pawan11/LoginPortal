import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { FormControl,FormGroup } from '../../../node_modules/@angular/forms';
import { Validators } from '../../../node_modules/@angular/forms';
import { Customer } from '../_models/customer.model';
import { SignupValidator } from '../_validations/Signup.validator';
import { LoginDetails } from '../_models/loginDetails.model';
import { SignupService } from '../_services/signup.service';
import { AlertService } from '../_services/alert.service';
import { CheckConnectionService } from '../_services/check-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm:FormGroup;
  customer:Customer;
  error='';
  connectionFlag:boolean=false;

  constructor(private router: Router,
    private signupService:SignupService,
    private alertService:AlertService,
    private connectionService:CheckConnectionService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.checkConnection();
  }

  checkConnection(){
    this.connectionService.checkSignupConnection()
    .then(response => {this.initializeForm(),this.connectionFlag=true})
    .catch(error=>this.openConnectionSnackBar("Connection Error","Reload"))
  }

  openConnectionSnackBar(message: string, action: string) {
    let snackBarRef=this._snackBar.open(message, action, {
      duration: 5000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.checkConnection();
    }); 
  }

  initializeForm(){
    this.signupForm=new FormGroup({
      username:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required,SignupValidator.validatePassword]),
      custName:new FormControl('',Validators.required),
      confirmPassword:new FormControl('',[Validators.required,SignupValidator.validateConfirmPassword]),
      dateOfBirth:new FormControl('',[Validators.required,SignupValidator.validateDateOfBirth]),
      mobileNumber:new FormControl('',[Validators.required,Validators.minLength(10)])
    });
  }


  signup(){
    let loginDetails:LoginDetails=new LoginDetails();
    let customer:Customer=new Customer();
    loginDetails.username=this.signupForm.controls.username.value;
    loginDetails.password=this.signupForm.controls.password.value;
    customer.loginDetails=loginDetails;
    customer.custName=this.signupForm.controls.custName.value;
    customer.dateOfBirth=this.signupForm.controls.dateOfBirth.value;
    customer.mobileNumber=this.signupForm.controls.mobileNumber.value;
    this.signupService.signup(customer)
    .then(response=>{
      this.alertService.showMessage("Customer Created Successfully!","OK"),
      this.router.navigate([''])
    })
    .catch(error=>{
      this.alertService.showMessage(error,"OK");
    })
  }
}
