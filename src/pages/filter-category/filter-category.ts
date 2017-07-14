import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FilterLocation } from '../filter-location/filter-location';
import { MyFeed } from '../myFeed/myFeed';


@Component({
  selector: 'page-filter-category',
  templateUrl: 'filter-category.html'
})
export class FilterCategory {
	id:any = this.navParams.get('id');
  show:number = 1;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterCategoryPage');
  }

  goto(num) {
  	if(num == 1){
  		this.navCtrl.push(FilterLocation, { id: num});
  	}
  	if(num == 2){ 
  		return;	
  	}
	}

  close(){
    this.navCtrl.setRoot(MyFeed);
  }
}
