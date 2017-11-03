import { Component, ViewChild,NgZone } from '@angular/core';
import { LoginData } from '../../providers/logindata/logindata';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationTracker } from '../../providers/locationtracker/locationtracker';
import { NavController,Platform, AlertController,LoadingController } from 'ionic-angular';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public patientForm;
  police="false";
  hospital= "false";
  driver="false";
  marker: any;
  map: any;

  username="";
   @ViewChild('map') mapElement;

  constructor(public loadingCtrl:LoadingController,public platform: Platform, public zone: NgZone,public locationTracker: LocationTracker, public alertCtrl:AlertController,public loginData: LoginData,  public formBuilder: FormBuilder, public navCtrl: NavController) {
    this.patientForm = formBuilder.group({
      state: ['', Validators.compose([Validators.minLength(5), Validators.required])],
      hptl: ['', Validators.compose([Validators.minLength(5), Validators.required])]
         })

    
  }
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }
  
  ionViewDidLoad() {
    
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
                this.locationTracker.gethospitals();
                                
            } 

            else if(this.username === "Hospital" || this.username === 'Hospital')
            {
                this.hospital = "true";
                this.zone.run(()=>{
                
                this.loginData.getData().then((username) => {
                let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
          loading.present();
              this.locationTracker.getDriverlocation(username);
                  setTimeout(() => {
                     let latlng = new google.maps.LatLng(this.locationTracker.home_lat, this.locationTracker.home_lon);
                let mapOptions = {
                  center: latlng,
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
               };
                this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                this.marker = new google.maps.Marker({
                map: this.map,
              // draggable: true,
                  //   title: this.locaData.name,
                 position: this.locationTracker.marker
               }); 
                
    loading.dismiss();
  }, 7000);
                   
                  
                 
                
                });
              //   let latlng = new google.maps.LatLng(this.locationTracker.home_lat, this.locationTracker.home_lon);
              //   let mapOptions = {
              //     center: latlng,
              //     zoom: 16,
              //     mapTypeId: google.maps.MapTypeId.ROADMAP
              //  };
              //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
              //   this.marker = new google.maps.Marker({
              //   map: this.map,
              // // draggable: true,
              //     //   title: this.locaData.name,
              //    position: latlng
              //  }); 
                });
                
    
  
                // this.login="true";      
            }
            else{
              this.police = "true";
              // this.login = "true";
            } 
        }
    });
  }
  g_latlng(){
         let latlng = new google.maps.LatLng(this.locationTracker.home_lat, this.locationTracker.home_lon);
    let mapOptions = {
      center: latlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
    map: this.map,
    // draggable: true,
    //   title: this.locaData.name,
       position: latlng
     });

  }
  start(){
    if(this.patientForm.value.hptl=="" || this.patientForm.value.state=="")
    {
      let alert = this.alertCtrl.create({
            message:"please provide complete details",
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
    }else{
    console.log("vales",this.patientForm.value.hptl,this.patientForm.value.state);
    this.locationTracker.startTracking(this.patientForm.value.hptl);
    // this.locationTracker.getDriverlocation("testing5");//testing


  }
 }

  
}
