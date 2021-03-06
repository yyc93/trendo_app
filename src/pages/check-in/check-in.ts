import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MyFeed } from '../myFeed/myFeed';
import { LocationP } from '../../providers/location';
import { User } from '../../providers/user';
import { Checkin } from '../../providers/checkin';
import { GlobalVars } from '../../providers/global-vars';

import { Geolocation } from '@ionic-native/geolocation';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { ModalAutocompleteItems } from '../modal-autocomplete/modal-autocomplete';

declare var google:any;

enum PostStyle {
    PS_TEXT = 0,
    PS_PHOTO = 1,
    PS_VIDEO = 2
}

@Component({
    selector: 'page-check-in',
    templateUrl: 'check-in.html',
    providers: [LocationP, Checkin, MediaCapture, Camera, Geolocation, Transfer, GlobalVars]
})
export class CheckIn {

    lat: any;
    lng: any;
    src: any;
    pic: boolean = true;
    loader = null;
    uploadFileCount : number;
    finishedCount : number;
    isErroruploading : boolean;
    checkinData : any;    
    
    private _map: any;
    public locatePos: any = {lat:'', lng:''};

    public postStyle: PostStyle;
    public base64Image: string;
    public data: any;
    public detail: any;
    public toUpload: any = { fileUrl: null, name: null };
    public toUpload2: any = { fileUrl: null, name: null };
    public fileTransfer: TransferObject;
    public myposts: boolean = this.userProvider.checkMyPost();

    constructor(public navCtrl: NavController
        , public navParams: NavParams
        , public _haversineService: HaversineService
        , public modalCtrl: ModalController
        , public alertCtrl: AlertController
        , public locationService: LocationP
        , public loadingCtrl: LoadingController
        , public checkinService: Checkin
        , private camera: Camera
        , private geolocation: Geolocation
        , public userProvider: User
        , public media: MediaCapture
        , public globalVars: GlobalVars
        , public transfer: Transfer) { }
        
    ionViewDidLoad() {
        console.log('ionViewDidLoad CheckInPage');
        this.fileTransfer = this.transfer.create();
        this.postStyle = PostStyle.PS_TEXT;

        this.loader = this.loadingCtrl.create({
            'spinner': 'dots',
            'content': 'Loading Nearby Locations...'
        });
        this.loader.present();
        this.geolocation.getCurrentPosition().then((resp) => {
            let lat = resp.coords.latitude;
            let lng = resp.coords.longitude;
            console.log("locataion Info (lat, lng)=(" + lat + "," + lng + ")");
            if( lng>110 && lng<130){
                lat = 36.124861;    //TODO: remove this code.
                lng = -115.168773;
            }
            this.locatePos.lat = lat;
            this.locatePos.lng = lng;
            this.locationService.getNearByPlaces(lat, lng).subscribe(
                response => {
                    this.loader.dismiss();
                    console.log(response.results);
                    this.data = response.results;
                    this.radioAlertFunc();
                },
                error => {
                    this.loader.dismiss();
                    console.log(error)
                });
        }).catch((error) => {
            this.loader.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Error getting location',
                message: error.message,
                enableBackdropDismiss: false,
                buttons: [{
                    text: 'Goto Myfeed',
                    handler: data => {
                        this.navCtrl.setRoot(MyFeed);
                    }
                }]
            });
            alert.present();
            console.log('Error getting location('+error.code+ ') : ' + error.message);
        });
    }

    radioAlertFunc() {
        let radioAlert = this.alertCtrl.create({
            enableBackdropDismiss: false
        });
        radioAlert.setTitle('Where are you:');
        for (var i = 0; i < this.data.length; ++i) {
            radioAlert.addInput({
                type: 'radio',
                label: this.data[i].name,
                value: this.data[i].place_id,
                checked: false
            });
        }
        radioAlert.addButton({
            text: 'Select',
            handler: data => {
                console.log(data);
                if (data == undefined) {
                    let alert = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'Please select a location.',
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OKAY',
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
                        if( this.detail ) {
                            this.locatePos.lat = this.detail.geometry.location.lat;
                            this.locatePos.lng = this.detail.geometry.location.lng;
                        }
                        console.log(this.detail)
                    },
                    error => console.log(error)
                );
            }
        });
        // radioAlert.addButton({
        //     text: 'Refresh',
        //     handler: data => {
        //         this.ionViewDidLoad();
        //     }
        // });
        radioAlert.addButton({
            text: 'Type Your Location',
            handler: data => {
                this.showTypeModal();
            }
        });
        radioAlert.addButton({
            text: 'Cancel',
            handler: data => {
                this.navCtrl.setRoot(MyFeed);
            }
        });
        
        radioAlert.present();
    }

    goto() {
        console.log(("check"));
    }

    takePicture() {

        let userChoice: boolean = this.userProvider.autoSavePicture();

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
            console.log("Camera pic Path::" + imageData);
            var filename = imageData.split('/').pop();
            this.uploadFileCount = 1;
            this.postStyle = PostStyle.PS_PHOTO;
            this.toUpload = { fileUrl: imageData, name: filename };
        }, (err) => {
            // Handle error
            console.log("Camera pic error::" + err);
        });
    }

    recordVideo() {
        let options: CaptureVideoOptions = {
            limit: 1,
            duration: 10,
            quality: 5
        };
        this.media.captureVideo(options)
            .then(
            (data: MediaFile[]) => {
                console.log("Captured video info::path=" + data[0].fullPath + " Size="+data[0].size);
                console.log("Captured video Thumb::path=" + data[1].fullPath + " Size="+data[1].size);
                this.postStyle = PostStyle.PS_VIDEO;
                this.toUpload = { fileUrl: data[0].fullPath, name: data[0].name };
                this.toUpload2 = { fileUrl: data[1].fullPath, name: data[1].name };
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
            spinner: 'dots',
            content: 'Posting your checkin...'
        });
        this.loader.present();
        let categories = [];
        for( let i=0; i<this.detail.types.length; i++){
            for( let j=0; j<this.globalVars.categories.length; j++){
                if( this.detail.types[i] == this.globalVars.categories[j]){
                    categories.push(this.detail.types[i])
                    break;
                }
            }
        }
        this.checkinData = {
            'user_id': JSON.parse(localStorage.getItem('user'))._id,
            'name': this.detail.name,
            'address': this.detail.formatted_address,
            'latitude': this.detail.geometry.location.lat,
            'longitude': this.detail.geometry.location.lng,
            'categories': categories,
            'comment': comment,
            'checkinType': checkinType
        };
        //'address': this.detail.address_components[0].long_name+','+this.detail.address_components[1].long_name+','+this.detail.address_components[2].long_name+','+this.detail.address_components[3].long_name+','+this.detail.address_components[4].long_name,
        
        this.isErroruploading = false;
        this.finishedCount = 0;
        if(this.postStyle == PostStyle.PS_VIDEO )
            this.uploadFileCount = (this.toUpload2.fileUrl!=null && this.toUpload2.fileUrl!='') ? 2 : 1;
        else
            this.uploadFileCount = 1;

        console.log(this.toUpload.fileUrl);
        if (this.toUpload.fileUrl != null && this.toUpload.fileUrl != '') {
            let options = this.getUploadOption(this.toUpload);
            if( options == null) return;

            this.fileTransfer.upload(this.toUpload.fileUrl, "http://curiouslabx.com/projects/file_upload.php", options)
            .then((data: any) => {
                console.log(data);
                this.checkinData.fileUrl = JSON.parse(data.response).filepath;
                console.log(this.checkinData);
                this.finishedCount++;
                console.log("Finished file count:"+this.finishedCount);
                if( this.finishedCount >= this.uploadFileCount ){
                    if( this.isErroruploading )
                        this.loader.dismiss();
                    else{                        
                        console.log(this.checkinData);
                        this.checkinService.userCheckIn(this.checkinData).subscribe(
                            response => {
                                this.loader.dismiss();
                                console.log(response);
                                this.navCtrl.setRoot(MyFeed);
                            },
                            error => {
                                console.error(error);
                                this.loader.dismiss();
                            }
                        );
                    }                   
                }
            }, (err) => {
                console.error("video file uplading error:"+JSON.stringify(err));
                this.finishedCount++;
                this.isErroruploading = true;
                this.loader.dismiss();
            });

            if(this.uploadFileCount>1){
                console.log(this.toUpload2.fileUrl);
                let options2 = this.getUploadOption(this.toUpload2);
                if( options2 == null) return;

                 this.fileTransfer.upload(this.toUpload2.fileUrl, "http://curiouslabx.com/projects/file_upload.php", options2)
                .then((data: any) => {
                    console.log(data);
                    this.checkinData.thumbUrl = JSON.parse(data.response).filepath;
                    console.log(this.checkinData);
                    this.finishedCount++;
                    console.log("Finished file count:"+this.finishedCount);
                    if( this.finishedCount >= this.uploadFileCount ){
                        if( this.isErroruploading )
                            this.loader.dismiss();
                        else{
                            console.log(this.checkinData);
                            this.checkinService.userCheckIn(this.checkinData).subscribe(
                                response => {
                                    this.loader.dismiss();
                                    console.log(response);
                                    this.navCtrl.setRoot(MyFeed);
                                },
                                error => {
                                    console.error(error);
                                    this.loader.dismiss();
                                }
                            );
                        }
                    }
                }, (err) => {
                    console.error("Thumb file uplading error : "+JSON.stringify(err));
                    this.finishedCount++;
                    this.isErroruploading = true;
                    this.loader.dismiss();
                });
            }
        }
        else {
            this.checkinService.userCheckIn(this.checkinData).subscribe(
                response => {
                    this.loader.dismiss();
                    console.log(response);
                    this.navCtrl.setRoot(MyFeed)
                },
                error => {
                    console.error(error);
                    this.loader.dismiss();
                }
            );
        }
    }

    getUploadOption(uploadFile: any): any {
        var options: any;
        options = {
            fileKey: 'file',
            fileName: uploadFile.name,
            headers: {}
        }

        var ext = uploadFile.fileUrl.split(".").pop();
        if (this.postStyle == PostStyle.PS_PHOTO) {
            if (ext == "jpg" || ext == "jpeg")
                options.mimeType = "image/jpeg";
            else if (ext == "png")
                options.mimeType = "image/png";
            else {
                this.presentOKAlert("Format Error", "This file is not able to post. Please try again with another format.");
                return;
            }
        } else if (this.postStyle == PostStyle.PS_VIDEO) {
            if (ext == "mp4")
                options.mimeType = "video/mp4";
            else if (ext == "3gp")
                options.mimeType = "video/3gpp";
            else if (ext == "avi")
                options.mimeType = "video/avi";
            else if (ext == "jpg")
                options.mimeType = "image/jpeg";
            else {
                this.presentOKAlert("Format Error", "This file is not able to post. Please try again with another format.");
                return;
            }
        } else {
            console.error("Error: Exist Post file, but postStyle is for Text");
        }
        options.httpMethod = "POST";
        options.chunkedMode = false;
        return options;
    }

    presentOKAlert(alertTitle: string, alertMsg: string) {

        let alert = this.alertCtrl.create({
            title: alertTitle,
            subTitle: alertMsg,
            buttons: ['OK']
        });
        alert.present();
    }

    private tryHaversine() {
        console.log("Tapped Marker");
    }

    showTypeModal() {

        // show modal|
        let self = this;
        let modal = this.modalCtrl.create(ModalAutocompleteItems);
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);            
            this.loader = this.loadingCtrl.create({
                'spinner': 'dots',
                'content': 'Loading Nearby Locations...'
            });
            this.loader.present();

            if(data){
                // get details
                self.locationService.getPlaceDetails(data.place_id).subscribe(
                    response => {
                        console.log('getPlaceDetails > detail >', response.result)
                        let lat = response.result.geometry.location.lat;
                        let lng = response.result.geometry.location.lng;
                        self.locationService.getNearByPlaces(lat, lng).subscribe(
                            response => {
                                self.loader.dismiss();
                                console.log(response.results);
                                self.data = response.results;
                                self.radioAlertFunc();
                            },
                            error => {
                                self.loader.dismiss();
                                console.log(error)
                            });
                    },
                    error => {
                        self.loader.dismiss();
                        console.log(error)
                    }
                );
            } else {
                this.locationService.getNearByPlaces(this.locatePos.lat, this.locatePos.lng).subscribe(
                    response => {
                        this.loader.dismiss();
                        console.log(response.results);
                        this.data = response.results;
                        this.radioAlertFunc();
                    },
                    error => {
                        this.loader.dismiss();
                        console.log(error)
                    }
                );
            }
        })
        modal.present();
    }

    // private createMapMarker(place:any):void {
    //     var placeLoc = place.geometry.location;
    //     var marker = new google.maps.Marker({
    //       map: this._map,
    //       position: placeLoc
    //     });    
    //     this.markers.push(marker);
    // }

    private initMapInstance(map) {
        console.log("initMapInstance()");
        this._map = map;
    }
}
