import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPeople } from '../search-people/search-people';

@Component({
  selector: 'page-search-places',
  templateUrl: 'search-places.html'
})
export class SearchPlaces {
	id:any = this.navParams.get('id');

  	constructor(public navCtrl: NavController, public navParams: NavParams) {}

	ionViewDidLoad() {
    	console.log('ionViewDidLoad SearchPlacesPage');
  	}

  	goto(num) {
	  	if(num == 1)
	  		return;
	  	if(num == 2) {
	  		this.navCtrl.pop();
	  		this.navCtrl.push(SearchPeople, { id: num });
	  	}
  	}

}
