import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { Login } from '../login/login';
import { MyFeed } from '../myFeed/myFeed';

import { User } from '../../providers/user';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [User]
})
export class Signup {

	public base64Image: string;
	public show:boolean = true;
  loader = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public userService: User, public loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signup(fname,lname,uname,email,pass) {
    this.loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Signing up'
    });
    this.loader.present();
    if(fname == undefined || fname == '' || lname == undefined || lname == '' || uname == undefined || uname == '' || email == undefined || email == '' || pass == undefined || pass == '') {
      let alert = this.alertCtrl.create({
        title:'Empty Fields',
        subTitle:'All Fields are mandatory.',
        buttons:['OK']
      });
      this.loader.dismiss();
      alert.present();
      return;
    }
    if(pass.length < 5) {
      let alert = this.alertCtrl.create({
        title:'Short Password',
        subTitle:'Password must be of atleast 5 charactors.',
        buttons:['OK']
      });
      this.loader.dismiss();
      alert.present();
      return;
    }
    var x = document.forms["myForm"]["email"].value;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
      let alert = this.alertCtrl.create({
        title:'Not a valid email address!!',
        message:'Please correct your email address and try again.',
        buttons:['Ok']
      });
      this.loader.dismiss();
      alert.present();
      return;
    }
    let user:any = {'firstname':fname, 'lastname':lname, 'username':uname, 'email':email, 'password':pass, 'avatar':this.base64Image};
    this.userService.signUp(user).subscribe(
      response => {
        let alert = this.alertCtrl.create({
          title:'Success',
          subTitle:'Welcome'+" "+response.firstname+" "+response.lastname,
          buttons:['OK']
        });
        this.loader.dismiss();
        alert.present();
        console.log(response);
        this.navCtrl.setRoot(MyFeed);
        user._id = response._id;
        localStorage.setItem('user', JSON.stringify(user));
      },
      error => {
        console.log(error);
        this.loader.dismiss();
      }
    );
  }

  login() {
  	this.navCtrl.setRoot(Login);
  }

  openCamera() {
  	let options:any = {
  		quality: 50,
  		destinationType: 0, //0 for base64, 1 for file URI, 2 for native URI
  		sourceType: 1, //PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
  		allowEdit: true,
  		encodingType: 0, //JPEG : 0 , PNG : 1
  		targetWidth: 200,
  		targetHeight:200,
  		// mediaType: 1, //Only works when PictureSourceType is PHOTOLIBRARY or SAVEDPHOTOALBUM.PICTURE: 0 ,VIDEO: 1,ALLMEDIA : 2
  		correctOrientation: true,
  		saveToPhotoAlbum: true,
  		cameraDirection:1, //BACK: 0 FRONT: 1
  	}

  	Camera.getPicture(options).then(
      (imageData) => {
			  this.base64Image = 'data:image/jpeg;base64,' + imageData;
	 		  this.show = false;
		  }, 
      (err) => {
	 		  console.log(err);
		  }
    );
  }

}
