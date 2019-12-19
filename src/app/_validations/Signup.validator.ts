import { AbstractControl } from '@angular/forms';


export class SignupValidator{

        private static password:string;
      
        static validatePassword(data:AbstractControl):any{
            let pass:string=data.value as string;
            
            if(pass.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")){
                SignupValidator.password=pass;
                return null;
            }else{
                return {"WrongPassword":true};
            }
        }

        static validateConfirmPassword(data:AbstractControl):any{
            let confirmPassword:string=data.value as string;
            if(confirmPassword==SignupValidator.password){
                return null;
            }else{
                return {"confirmPasswordError":true};
            }
        }

        static validateDateOfBirth(data:AbstractControl):any{
            let dob=data.value as Date;
            let today=new Date();
            if(dob<today){
                //console.log(today+" "+dob);
                return null;
            }else{
                return{"dateOfBirthError":true};
            }
        }
}