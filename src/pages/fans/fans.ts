import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { MyFeed } from '../myFeed/myFeed';
import { PlaceDetail } from '../place-detail/place-detail';
import { UserDetail } from '../user-detail/user-detail';
import { LocationPage } from '../location/location';
import { SearchPeople } from '../search-people/search-people';
import { FilterCategory } from '../filter-category/filter-category';
import { CheckIn } from '../check-in/check-in';
import { _Notification } from '../notification/notification';
import { Business } from '../../providers/business';

import { Checkin } from '../../providers/checkin';

@Component({
  selector: 'page-fans',
  templateUrl: 'fans.html',
  providers:[Checkin, Business]
})
export class Fans {

	private id:number = this.navParams.get('id');
	public data:any = [];
	private dateTime:Date = new Date();
	public empty:boolean = true;
	public businessAd:any = [];
	tmp:any;
	loader = null;
	length:number;
	j = 1;

	constructor(public business: Business, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public checkinProvider: Checkin ) {}

	ionViewDidLoad(){
		console.log(this.dateTime.getDate()+"/"+this.dateTime.getDay()+"/"+this.dateTime.getFullYear());
		console.log(this.dateTime.getHours()-12+":"+this.dateTime.getMinutes()+":"+this.dateTime.getSeconds());
		this.loader = this.loadingCtrl.create({
			spinner:'dots',
			content:'Loading Checkins...'
		});
		this.loader.present();

		if(this.id == undefined) 
			this.id = 1;
		let user_id = JSON.parse(localStorage.getItem('user'))._id;
		this.checkinProvider.followersCheckins(user_id).subscribe(
			response => {
				console.log(Object.getOwnPropertyNames(response).length);
				if(Object.getOwnPropertyNames(response).length == 0) {
					console.log("empty")
					this.empty = false;
					this.loader.dismiss();
					return
				}
				console.log(response);
				this.tmp = response;
				this.length = response.length;
				this.success(0);
				this.loader.dismiss();
			},
			error => {
				console.error(error);
				this.loader.dismiss();
				let alert = this.alertCtrl.create({
					title:'ERROR!!',
					subTitle:error,
					buttons:['OK']
				});
				alert.present();
			}
		)
	}

	success(i){
		if(i != this.length) {
			this.tmp[i].type = 'user';

			if(this.tmp[i].fileUrl != undefined)
			{
				if(this.tmp[i].fileUrl.indexOf('mp4') > 0)
					this.tmp[i].fileType = 'video';
				else
					this.tmp[i].fileType = 'image';
			}

			this.data.push(this.tmp[i]);
			if(this.j == 5) {
				this.businessAds(i);
				return;
			}
			this.j++;
			this.success(i+1);
		}
		else if( i == this.length){
			console.log('complete');
			this.loader.dismiss();
			return;
		}
	}

	businessAds(i) {
		this.j = 1;
		this.business.getBuisenessAds().subscribe(
			response => {
				if(response != null) {
					response.type = 'business';
					this.businessAd = response;
					this.data.push(this.businessAd);
					this.success(i+1);
				}
			},
			error => console.log(error)
		);
	}

	goto(num){
		if(num == 2)
			this.navCtrl.setRoot(MyFeed);
		else if(num == 3) 
			this.navCtrl.setRoot(_Notification);
	    else if(num == 4) 
	      this.navCtrl.setRoot(FilterCategory, { id: '1'});
	}

	gotoDetails(placeId){
		console.log(placeId)
		this.navCtrl.push(PlaceDetail, {id: placeId});
	}

	gotoUser(user_id){
  		this.navCtrl.push(UserDetail, {'id':user_id});
	}

	gotoLocation() {
  		this.navCtrl.push(LocationPage);
	}

	gotoSearch(num) {
  	if (num == 1)
 		this.navCtrl.push(SearchPeople, {id: num});
	}

	checkIn() {
		this.navCtrl.push(CheckIn);
	}

	doRefresh(refresher) {
		this.ionViewDidLoad();

		setTimeout(() => {
	      console.log('Async operation has ended');
	      refresher.complete();
	    }, 2000);
	}
}
