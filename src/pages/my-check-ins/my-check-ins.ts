import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { CheckIn } from '../check-in/check-in';
import { PlaceDetail } from '../place-detail/place-detail';

import { Checkin } from '../../providers/checkin';
import { User } from '../../providers/user';

@Component({
  selector: 'page-my-check-ins',
  templateUrl: 'my-check-ins.html',
  providers: [Checkin, User]
})
export class MyCheckIns {

  public data: any = [];
  public empty: boolean = false;
  loader = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public checkinService: Checkin, public userService: User) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyCheckin Page');
    this.loader = this.loadingCtrl.create({
      'spinner': 'dots',
      'content': 'Loading your checkins...'
    });
    this.loader.present();

    this.checkinService.getUserCheckIn(this.userService.getCurrentUser()._id).subscribe(
      response => {
        if (response.length == 0) {
          this.empty = false;
          this.loader.dismiss();
          return;
        }
        console.log(response);
        this.empty = true;
        for (var i = 0; i < response.length; ++i) {
          if(response[i].fileUrl != undefined)
          {
            if(response[i].fileUrl.indexOf('mp4') > 0)
              response[i].fileType = 'video';
            else
              response[i].fileType = 'image';

            this.data.push(response[i]);
          }
        }
        this.loader.dismiss();
      },
      error => {
        console.log(error);
        this.loader.dismiss();
      }
    );
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 5000);
  }

  checkIn() {
    this.navCtrl.push(CheckIn);
  }

	gotoDetails(placeId){
		console.log(placeId)
		this.navCtrl.push(PlaceDetail, {id: placeId});
	}
}
