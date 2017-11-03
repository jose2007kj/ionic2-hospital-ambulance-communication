import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';
import firebase from 'firebase';
import { LoginData } from '../logindata/logindata';

@Injectable()
export class AuthData {
  // Here we declare the variables we'll be using.
  public fireAuth: any;
  public userProfile: any;
 public userDetails: any;

  constructor(public loginData: LoginData, public events: Events) {
    this.fireAuth = firebase.auth(); // We are creating an auth reference.
    // This declares a database reference for the userProfile/ node.
    this.userProfile = firebase.database().ref('/userProfile');
    this.userDetails = firebase.database().ref('/userDetails');
  }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(email: string, password: string, name:string, pno: number, role:string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
        this.userProfile.push({
          email:email,
          id: authenticatedUser.uid,
           Name: name,
          Phone_no: pno,
          Role:role
        
         }).then (newEvent =>{
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
        //   this.userDetails.child(role).child(authenticatedUser.uid).set({
        //   email: email,
        //   Name: name,
        //   Phone_no: pno,
        //   Role:role
         });
        })
        
      
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): any {
    return this.fireAuth.signOut();
  }
  getRole(email: string):any{
    firebase.database().ref('userProfile').orderByChild("email").equalTo(email).on("child_added", (snapshot) => {
          console.log(snapshot.val());
          return  snapshot.val().Role;
          
    });
  }

}
