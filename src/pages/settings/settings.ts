import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { MyFeed } from '../myFeed/myFeed';
import { MyCheckIns } from '../my-check-ins/my-check-ins';

import { User } from '../../providers/user';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers:[User]
})
export class Settings {

	public checked:boolean = false;
  public savePic:boolean = this.user.autoSavePicture();
  public myPost :boolean = this.user.checkMyPost();
	loader = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public user: User) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    // let user = JSON.parse(localStorage.getItem('user'));
    this.loader = this.loadingCtrl.create({
    	spinner:'dots',
    	content:'Checking your settings...',
    });
    this.loader.present();

    this.user.getUserProfile(this.user.getCurrentUser()._id).subscribe(
    	response => {
        console.log(response)
    		if(response.autoFriend == true)
    			this.checked = true;
    		  this.loader.dismiss();
    	},
    	error => {
    		let alert = this.alertCtrl.create({
    			title:'Error',
    			subTitle:error,
    			buttons:['OK']
    		});
    		this.loader.dismiss();
    		alert.present();
    	}
  	);
  }

  update(value) {
    if(value == undefined) {
      return;
    }
    let loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Updating...'
    });
    loader.present();
    this.user.updateAutoFriend(value).subscribe(
      response => {
        console.log(response);
        loader.dismiss();
      },
      error => {
        console.error(error);
        let alert = this.alertCtrl.create({
          title:'Error',
          subTitle:error,
          buttons:['OK']
        });
        loader.dismiss();
        alert.present();
      }
    );
  }

  updatePic(value) {
    this.user.setAutoSavePicture(value);
  }

  updateMyPost(value) {
    this.user.setMyPost(value);
  }

  goto(page) {
    if (page == 'MyCheckIns') {
      this.navCtrl.push(MyCheckIns)
    } 
  }

}
