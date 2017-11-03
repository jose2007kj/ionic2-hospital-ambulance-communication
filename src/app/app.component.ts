import { Component, ViewChild, NgZone} from '@angular/core';
import { Platform , MenuController,Events, ViewController} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { LoginData } from '../providers/logindata/logindata';
import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  username="";
  police="false";
  hospital= "false";
  driver="false";
  login="true";
public rootPage: any;
 @ViewChild('content') nav: any;

zone: NgZone;
  constructor(platform: Platform, public menu: MenuController, public loginData: LoginData , public events: Events) {
      this.zone = new NgZone({});
   firebase.initializeApp({
   apiKey: "AIzaSyDIvH1yDoAInv2hb8NC9WQ38G3J_Vr1nXI",
    authDomain: "emergency-cb240.firebaseapp.com",
    databaseURL: "https://emergency-cb240.firebaseio.com",
    projectId: "emergency-cb240",
    storageBucket: "emergency-cb240.appspot.com",
    messagingSenderId: "290168191420"
    });
     
  const unsubscribe= firebase.auth().onAuthStateChanged((user) => {
  this.zone.run( () => {
    if (!user) {
      this.rootPage=LoginPage;
      unsubscribe();
    }else{
    this.rootPage=HomePage;
      unsubscribe();
    }
    });
  });

  	//this.rootPage=HomePage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
   
  
  
  
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.loginData.getData().then((username) => {
        this.username = username;
        if (this.username === null || this.username === 'null') {
            this.username = "false";
        } else {
           // this.username = username;
            console.log("username is:",username);
            
            if(this.username === "Driver" || this.username === 'Driver')
            {
                this.driver = "true";
                this.login="true";
            } 

            else if(this.username === "Hospital" || this.username === 'Hospital')
            {
                this.hospital = "true";  
                this.login="true";      
            }
            else{
              this.police = "true";
              this.login = "true";
            } 
        }
    });

    // -----------detecting login and logout of admin------------ 

    this.events.subscribe('driver:login', () => {
      this.driver = "true";
      this.login = "true";
    }); 

    this.events.subscribe('driver:logout', () => {
      this.driver = "false";
      this.login = "false";
    });
    // -----------detecting login and logout of user------------ 

    this.events.subscribe('police:login', () => {
      this.police = "true";
      this.login = "true";
    }); 

    this.events.subscribe('police:logout', () => {
      this.police = "false";
      this.login = "false";
    });

    // ------------detecting login and logout of acc_manager---------------
    
    this.events.subscribe('hospital:login', () => {
      this.hospital = "true";
      this.login="true";
    });

    this.events.subscribe('hospital:logout', () => {
      this.hospital = "false";
      this.login="false";
    });
  }
   openPage(page) {
    let viewCtrl: ViewController = this.nav.getActive();
    // close the menu when clicking a link from the menu
    this.menu.close();
     if (page === 'LoginPage') {
     
      if (!(viewCtrl.instance instanceof LoginPage))
        this.nav.push(LoginPage);
    }
  }
 logOut(){
      firebase.auth().signOut().then(() => {
       this.loginData.setData('null');
      this.events.publish('police:logout');
      this.events.publish('hospital:logout');
      this.events.publish('driver:logout');

       this.nav.setRoot(LoginPage);
    });
 }
}
