import { NavController, LoadingController, Events, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data/auth-data';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';
import { SignupPage } from '../signup/signup';
// providers
import { LoginData } from '../../providers/logindata/logindata';

import firebase from 'firebase';
//import { LoginData } from '../../providers/logindata';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
}) 
export class LoginPage {

  public loginForm;
  public role: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  
  constructor(
    public loginData:LoginData,
    public nav: NavController,
     public events: Events,
     // public loginData: LoginData,
       public authData: AuthData,
        public formBuilder: FormBuilder,
         public alertCtrl: AlertController,
          public loadingCtrl: LoadingController
      ) {
    /**
     * Creates a ControlGroup that declares the fields available, their values and the validators that they are going
     * to be using.
     *
     * I set the password's min length to 6 characters because that's Firebase's default, feel free to change that.
     */
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }
  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }
  /**
   * If the form is valid it will call the AuthData service to log the user in displaying a loading component while
   * the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  loginUser(){
    this.submitAttempt = true;
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        console.log("ath data:",authData);
        console.log("ath data:",authData.uid);
         firebase.database().ref('userProfile').orderByChild("email").equalTo(this.loginForm.value.email).on("child_added", (snapshot) => {
          console.log(snapshot.val());
          var role=snapshot.val().Role;
            this.loginData.setName(snapshot.val().Name);
          console.log("role",role,typeof(role)); 
                    if (role === "Police" || role === 'Police') {
            this.events.publish('police:login');
            this.loginData.setData('Police'); // for identifying the role
          }
          else if (role === "Driver" || role === 'Driver') {
            this.events.publish('driver:login');
            this.loginData.setData('Driver'); // for identifying the role
          }
          else {
            this.events.publish('hospital:login');
            this.loginData.setData('Hospital');
          }
          
          this.loading.dismiss().then(()=> 
          {
            this.nav.setRoot(HomePage);
            });
        });
        
       
 
              }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
      
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
  goToSignup(){
    this.nav.push(SignupPage);
  }
  goToResetPassword(){
    //this.nav.push(ResetPasswordPage);
  }
}