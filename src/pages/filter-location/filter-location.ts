import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FilterCategory } from '../filter-category/filter-category';
import { MyFeed } from '../myFeed/myFeed';

@Component({
  selector: 'page-filter-location',
  templateUrl: 'filter-location.html'
})
export class FilterLocation {
	id:any = this.navParams.get('id');

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterLocationPage');
  }

  goto(num) {
  	if(num == 1){
  		return;
  	}
  	if(num == 2){ 
  		this.navCtrl.push(FilterCategory, { id: num});
  	}
	}

  close(){
    this.navCtrl.setRoot(MyFeed);
  }

}
