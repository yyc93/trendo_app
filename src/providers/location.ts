import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GlobalVars } from '../providers/global-vars';

@Injectable()
export class LocationP {
	
	baseUrl:any;
  constructor(public http: Http, public globalVars: GlobalVars) {
    console.log('Hello Location Provider');
  }

  getNearByPlaces(lat, lng) {
    let categories : string = '';
    for( var i = 0; i<this.globalVars.categories.length; i++ ){
      if( categories.length > 0)
        categories += '|';
      categories += this.globalVars.categories[i];
    }
    let param_type : string = '';
    if( categories.length > 0)
      param_type = "&type="+categories;
  	this.baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=50'+param_type+'&key='+this.globalVars.googleApiKey;
  	return this.http.get(this.baseUrl) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  getPlaceDetails(place_Id) {
  	this.baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+place_Id+'&key='+this.globalVars.googleApiKey;
  	return this.http.get(this.baseUrl) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }
}
