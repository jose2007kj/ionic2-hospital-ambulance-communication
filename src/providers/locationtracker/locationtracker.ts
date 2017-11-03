import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';
 import firebase from 'firebase';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LocationTracker {
   public marker: any;
   public fireAuth: any;
   public h_name: any;
  public driverLocation: any;
  public hosp_list_home=[];
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  public home_lat=9.9949365;
  public home_lon=76.3597836;

  public loading: any;
 user = firebase.auth().currentUser;
 userProfile: any;
 date1: any;
 date: any;
 time: any;
  constructor(public loadingCtrl:LoadingController,public http: Http,public zone: NgZone) {
      this.date1  = new Date().toISOString();
      console.log(this.date);
   
     this.driverLocation = firebase.database().ref('/driverLocation');
     this.userProfile=firebase.database().ref('/userProfile');
  }
 
  startTracking(hptl:string) {
      this.time=this.date1.slice(11,13)+this.date1.slice(14,16);
      
      this.date=this.date1.slice(0,4)+this.date1.slice(5,7)+this.date1.slice(8,10);
            console.log(this.date,this.time);
 var temp=0; 
  // Background Tracking
 
  let config = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 10, 
    debug: true,
    interval: 2000 
  };
 
  BackgroundGeolocation.configure((location) => {
 
    console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
        if(this.user!=null){
             if(temp==0){
              this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('start_lat').set(location.latitude);
              this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('start_lon').set(location.longitude);
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('hospital').set(hptl);
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('status').set('active');
             }this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('crnt_lat').set(location.latitude);
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('crnt_lon').set(location.longitude);
               temp++;
        }
      this.lat = location.latitude;
      this.lng = location.longitude;

    });
 
   }, (err) => {
 
    console.log(err);
 
  }, config);
 
  // Turn ON the background-geolocation system.
  BackgroundGeolocation.start();
 
 
  // Foreground Tracking
 
  let options = {
    frequency: 3000, 
    enableHighAccuracy: true
  };
 
  this.watch = Geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
 
    console.log(position);
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
           if(temp==0){
            this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('start_lat').set(position.coords.latitude);
              this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('start_lon').set(position.coords.longitude);
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('hospital').set(hptl);
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('status').set('active');
           }    
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('crnt_lat').set(position.coords.latitude);
               this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('crnt_lon').set(position.coords.longitude);
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      temp++;
    });
 
  });
 
}
stopTracking() {
 
  console.log('stopTracking');
 
  BackgroundGeolocation.finish();
  this.watch.unsubscribe();
                 this.driverLocation.child(this.date).child(this.time).child(this.user.uid).child('status').set('inactive');

 
}
gethospitals(){
    firebase.database().ref('userProfile').orderByChild("Role").equalTo("Hospital").on("child_added", (snapshot) => {
          console.log(snapshot.val());
          this.hosp_list_home.push(snapshot.val().Name);
          var role=snapshot.val().Role;
          console.log("role",role,typeof(role)); 
                   
       
 
              }, error => {
                  console.log(error);
       
      });
 
}
getDriverlocation(name: string){
  var user = firebase.auth().currentUser;
   //var h_name;
        if (user) {
            console.log(user);
            
            firebase.database().ref('userProfile').orderByChild("email").equalTo(user.email).on("child_added", (snapshot) => {
            console.log(snapshot.val());
            this.h_name=snapshot.val().Name;
            
            console.log("role",this.h_name); 
                   
        });
        
  // User is signed in.
        } else {
  // No user is signed in.
        }
console.log('inside getlocation',name);      
this.driverLocation.on('child_added', (sItems) => {
    

      console.log(sItems.val());
    //   for(let item in sItems.val()){
    //       console.log(item);
    // //   if(item){
    // //       this.home_lat=sItems.val().crnt_lat;
    // //       this.home_lon=sItems.val().crnt_lon;
    // //       console.log(this.home_lat,this.home_lon);
    // //   }
    //   }
        // this.loading.present().then(() => {
        Object.keys(sItems.val()).forEach(key => {
        
    
        console.log("testing",sItems.val()[key]);
        Object.keys(sItems.val()[key]).forEach(key1 => {
        //console.log("inside driver",sItems.val()[key][key1].hospital);  
        console.log("testing2 ",sItems.val()[key][key1],this.h_name);
        var temp=0;
        if(sItems.val()[key][key1].hospital==this.h_name){
        console.log("inside driver ????",sItems.val()[key][key1].hospital);
         this.home_lat=sItems.val()[key][key1].crnt_lat;
         this.home_lon=sItems.val()[key][key1].crnt_lon;
         console.log(sItems.val()[key][key1].hospital,name,this.home_lat,this.home_lon);
         var revLoc = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.home_lat + "," + this.home_lon + "&sensor=true";
        this.http.get(revLoc).map(res => res.json()).subscribe(data => {
          console.log("revloc", revLoc);
          // debugger;
          
          console.log("reverse location", data.results[0].formatted_address);
          this.marker=data.results[0].geometry.location;
          console.log("reverse location geometry", data.results[0].geometry.location);
                
      });
      // if (temp==0){
      //     temp=1;
      //     return 1;}
        
      //    //return this.home;
       }
        });
        
        // });
        });
        
    
      //************************************************************************ */
      
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
    );
              


      
}
}