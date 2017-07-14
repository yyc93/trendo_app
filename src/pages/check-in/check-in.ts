import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MyFeed } from '../myFeed/myFeed';
import { LocationP } from '../../providers/location';
import { User } from '../../providers/user';
import { Checkin } from '../../providers/checkin';

import { Geolocation } from '@ionic-native/geolocation';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Component({
  selector: 'page-check-in',
  templateUrl: 'check-in.html',
  providers: [ LocationP, Checkin, MediaCapture, Camera, Geolocation,Transfer ]
})
export class CheckIn {
	
	lat: any;
	lng: any;
  src: any;
	pic: boolean = true;
  loader = null;
  public base64Image: string;
  public data:any;
  public detail:any;
  public toUpload:any = {fileUrl:null, name:null};
  public fileTransfer:TransferObject;
  public myposts: boolean = this.userProvider.checkMyPost();

  constructor(public navCtrl: NavController, public navParams: NavParams, public _haversineService: HaversineService, public alertCtrl: AlertController, public locationService: LocationP, public loadingCtrl: LoadingController, public checkinService: Checkin,  private camera: Camera, private geolocation: Geolocation, public userProvider: User, public media: MediaCapture, public transfer: Transfer) {}
  ionViewDidLoad() {
    const fileTransfer: TransferObject = this.transfer.create();

    console.log('ionViewDidLoad CheckInPage');
    this.loader = this.loadingCtrl.create({
      'spinner': 'dots',
      'content': 'Loading Nearby Locations...'
    });
    this.loader.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      let lat = resp.coords.latitude;
      let lng = resp.coords.longitude;
      
      this.locationService.getNearByPlaces(lat, lng).subscribe(
        response => {
          console.log(response.results)
          this.data = response.results;
          this.radioAlertFunc();
        },
        error => console.log(error)
        );
    }).catch((error) => {
      let alert = this.alertCtrl.create({
        title:'Error',
        subTitle:'Error getting location',
        message:error,
        enableBackdropDismiss: false,
        buttons:[{
          text:'Goto Myfeed',
          handler: data => {
            this.navCtrl.setRoot(MyFeed);
          }
        }]
      });
      this.loader.dismiss();
      alert.present();
      console.log('Error getting location'+ JSON.parse(error));
    });
  }

  radioAlertFunc(){
  	let radioAlert = this.alertCtrl.create({
      enableBackdropDismiss: false
    });
    radioAlert.setTitle('Where are you:');
    for (var i = 0; i < this.data.length; ++i) {
    	radioAlert.addInput({
        type:'radio',
        label:this.data[i].name,
        value:this.data[i].place_id,
        checked:false
      });
    }
    radioAlert.addButton({
    	text:'Select',
    	handler: data => {
    		console.log(data);
        if (data == undefined) {
          let alert = this.alertCtrl.create({
            title:'Error',
            subTitle:'Please select a location.',
            enableBackdropDismiss: false,
            buttons:[{
              text:'OKAY',
              handler: data => {
                this.radioAlertFunc();
              }
            }]
          });
          this.loader.dismiss();
          alert.present();
          return;
        }
    		this.locationService.getPlaceDetails(data).subscribe(
          response => {
            this.detail = response.result;
            console.log(this.detail)
          },
          error => console.log(error)
          );
    	}
    });
    radioAlert.addButton({
      text:'Refresh',
      handler: data => {
        this.ionViewDidLoad();
      }
    });
    radioAlert.addButton({
      text:'Cancel',
      handler: data => {
        this.navCtrl.setRoot(MyFeed);
      }
    });
    this.loader.dismiss();
    radioAlert.present();
  }

  goto(){
  	console.log(("check"));
  }

  takePicture() {
    
    let userChoice :boolean = this.userProvider.autoSavePicture();

    const options: CameraOptions = {
      quality: 80,
      destinationType: 2,
      sourceType: 1,
      allowEdit: true,
      encodingType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: userChoice,
      cameraDirection: 1
    }

    this.camera.getPicture().then((imageData) => {
     this.toUpload = {fileUrl:imageData, name:'photo'};
    }, (err) => {
     // Handle error
    });
  }

  recordVideo(){
    let options:any = { 
      limit: 1,
      duration: 10,
      quality: 100 
    };
    this.media.captureVideo(options)
    .then(
      (data: MediaFile[]) => {
        console.log(data)
        this.toUpload = {fileUrl:data[0].fullPath, name:data[0].name};
      },
      (err: CaptureError) => console.log(err)
      );
  }

  makeCheckin(comment: any, type: boolean) {
    let checkinType;
    if (type == false) {
      checkinType = 'private';
    }
    else if (type == true) {
      checkinType = 'public';
    }
    console.log(checkinType);
    this.loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Posting your checkin...'
    });
    this.loader.present();
    let checkinData:any = {
      'user_id':JSON.parse(localStorage.getItem('user'))._id,
      'name':this.detail.name,
      'address': this.detail.address_components[0].long_name+','+this.detail.address_components[1].long_name+','+this.detail.address_components[2].long_name+','+this.detail.address_components[3].long_name+','+this.detail.address_components[4].long_name,
      'latitude': this.detail.geometry.location.lat,
      'longitude': this.detail.geometry.location.lng,
      'comment':comment,
      'checkinType':checkinType

    };
   
    var options: any;
    options = {
      fileKey: 'file',
      fileName: this.toUpload.name,
      headers: {}
    }

    options.mimeType="image/jpeg";
    options.httpMethod="POST";
    options.chunkedMode=false;

    console.log(this.toUpload.fileUrl);
    if(this.toUpload.fileUrl != null && this.toUpload.fileUrl != '')
    {
      this.fileTransfer.upload(this.toUpload.fileUrl, "http://curiouslabx.com/projects/file_upload.php", options)
      .then((data: any) => {
        console.log(data);
        checkinData.fileUrl = JSON.parse(data.response).filepath;
        console.log(checkinData); 
        this.checkinService.userCheckIn(checkinData).subscribe(
          response => {
            this.loader.dismiss();
            console.log(response);
            this.navCtrl.setRoot(MyFeed)
          },
          error => {
            console.log(error);
            this.loader.dismiss();
          }
        );
      }, (err) => {
        console.log(err);
        this.loader.dismiss();
      })
    }
    else
    {
      this.checkinService.userCheckIn(checkinData).subscribe(
          response => {
            this.loader.dismiss();
            console.log(response);
            this.navCtrl.setRoot(MyFeed)
          },
          error => {
            console.log(error);
            this.loader.dismiss();
          }
        );
    }
    
  }

}
