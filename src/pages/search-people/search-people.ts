import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPlaces } from '../search-places/search-places';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html'
})
export class SearchPeople {
	id:any = this.navParams.get('id');
	search:any = this.navParams.get('type');

  	constructor(public navCtrl: NavController, public navParams: NavParams) {}

  	ionViewDidLoad() {
		if( this.search == undefined ){
			this.search = 'people';
		}
		console.log('ionViewDidLoad SearchPeoplePage id:', this.id, ' searchType: ', this.search);
		
  	}

  	goto(num) {
	  	if(num == 1){
	  		this.navCtrl.pop();
	  		this.navCtrl.push(SearchPlaces, { id: num});
	  	}
	  	if(num == 2) 
	  		return;
  	}

}
