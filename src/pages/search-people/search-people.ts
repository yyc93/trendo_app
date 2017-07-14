import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPlaces } from '../search-places/search-places';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html'
})
export class SearchPeople {
	id:any = this.navParams.get('id');
  show:number = 2;

  	constructor(public navCtrl: NavController, public navParams: NavParams) {}

  	ionViewDidLoad() {
    	console.log(this.id);
    	console.log('ionViewDidLoad SearchPeoplePage');
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
