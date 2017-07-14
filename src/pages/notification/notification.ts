import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Fans } from '../fans/fans';
import { MyFeed } from '../myFeed/myFeed';
import { LocationPage } from '../location/location';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class _Notification {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  goto(num){
		if(num == 1)
			this.navCtrl.setRoot(Fans);
		else if(num == 2) 
			this.navCtrl.setRoot(MyFeed);
	}

	gotoLocation() {
  		this.navCtrl.push(LocationPage);
	}

}
