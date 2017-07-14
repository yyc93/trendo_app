import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation, Transfer } from 'ionic-native';

/*
  Generated class for the Location page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-location',
  	templateUrl: 'location.html'
  })
  export class LocationPage {

  	loader = null;
  	lat:any;
  	lng:any;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

  	ionViewDidLoad() {
  		console.log('ionViewDidLoad LocationPage');

  		this.loader = this.loadingCtrl.create({
  			'spinner': 'dots',
  			'content': 'Loading Location'
  		});
  		this.loader.present();
  		Geolocation.getCurrentPosition().then((resp) => {
  			this.lat = resp.coords.latitude;
  			this.lng = resp.coords.longitude;

  			this.loader.dismiss();
  		}).catch((error) => {
  			let alert = this.alertCtrl.create({
  				title:'Error',
  				subTitle:'Error getting location',
  				message:error,
  				buttons:[{
  					text:'Ok'
  				}]
  			});
  			this.loader.dismiss();
  			alert.present();
  			console.log('Error getting location'+ error);
  		});
  	}

  }
