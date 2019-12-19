import { Component, OnInit } from '@angular/core';
import { Customer } from '../_models/customer.model';
import { Router } from '../../../node_modules/@angular/router';
import { FormControl,FormGroup, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { SignupService } from '../_services/signup.service';
import { LoginService } from '../_services/login.service';
import { AlertService } from '../_services/alert.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { CheckConnectionService } from '../_services/check-connection.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer:Customer=new Customer();
  editForm:FormGroup;
  dataFlag:boolean=false;
  editFlag:boolean=false;
  connectionFlag:boolean=false;
  imageUrl:string=window["imageUrl"];

  constructor(private signupService:SignupService,
    private loginService:LoginService,
    private router: Router,
    private formBuilder:FormBuilder,
    private alertService:AlertService,
    private connectionService:CheckConnectionService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.checkConnection();
    //this.getUserDetails()
  }

  checkConnection(){
    this.connectionService.checkSignupConnection()
    .then(response => {this.getUserDetails(),this.connectionFlag=true})
    .catch(error=>this.openConnectionSnackBar("Connection Error!!","Reload"))
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
    this.dataFlag=true;
    this.editForm=new FormGroup({
      custName:new FormControl('',Validators.required),
      username:new FormControl('',[Validators.required,Validators.email]),
      mobileNumber:new FormControl('',[Validators.required,Validators.minLength(10)]),
      dateOfBirth:new FormControl('',Validators.required),
      location:new FormControl(''),
      teamName:new FormControl('')
    });
  }

  getUserDetails(){
    this.customer=JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.customer!=null){
      this.dataFlag=true;
      console.log("Current User"+JSON.stringify(this.customer));
      this.initializeForm();
      this.setCustomerDetails(this.customer);
    }
    // this.customer=JSON.parse(this.setDummyData());
    // this.setDummyData();
  }

  // setDummyData(){
  //   this.customer.customerId=1024;
  //   this.customer.custName="Pawan Pandey";
  //   this.customer.dateOfBirth=new Date();
  //   this.customer.location="Pune";
  //   this.customer.mobileNumber=9891306503;
  //   this.customer.teamName="Avengers";
  //   let loginDetails:LoginDetails=new LoginDetails();
  //   loginDetails.username="pawan.pandey03@infosys.com";
  //   this.customer.loginDetails=loginDetails;
  // }

  setCustomerDetails(customer:Customer){
    //console.log(JSON.stringify(customer));
    this.editForm.controls.custName.setValue(this.customer.custName);
    this.editForm.controls.username.setValue(this.customer.loginDetails.username);
    this.editForm.controls.mobileNumber.setValue(this.customer.mobileNumber);
    this.editForm.controls.dateOfBirth.setValue(this.customer.dateOfBirth);
    this.editForm.controls.location.setValue(this.customer.location);
    this.editForm.controls.teamName.setValue(this.customer.teamName);
    
  }

  getCustomerDetails():any{
    let customer:Customer=new Customer();
    customer.customerId=this.customer.customerId;
    customer.loginDetails=this.customer.loginDetails;
    customer.custName=this.editForm.controls.custName.value;
    customer.mobileNumber=this.editForm.controls.mobileNumber.value;
    customer.dateOfBirth=this.editForm.controls.dateOfBirth.value;
    customer.location=this.editForm.controls.location.value;
    customer.teamName=this.editForm.controls.teamName.value;
    return customer;
  }

  update(){ 
    let customer=this.getCustomerDetails();
    console.log("Update Object"+JSON.stringify(customer));
    this.signupService.updateCustomer(customer)
    .then(response=>{
      this.editFlag=false,
      sessionStorage.setItem("currentUser",JSON.stringify(customer)),
      this.getUserDetails(),
      this.alertService.showMessage("Customer Details Updated Successfully!","OK")
    })
    .catch(error=>{
      this.alertService.showMessage(error,"OK");
    })
  }

  editButtonTrigger(){
    this.editFlag=true;
  }

  disable(){
    console.log("Delete username"+this.customer.loginDetails.username)
    this.signupService.disableCustomerDetails(this.customer.loginDetails.username)
    .then(response=>{
      this.alertService.showMessage("Customer Deleted Successfully!","OK"),
      this.editFlag=false,
      this.logout()
    })
    .catch(error=>{
      this.alertService.showMessage(error,"OK");
    })
  }

  logout(){
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
