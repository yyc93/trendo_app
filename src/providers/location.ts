import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocationP {
	
	baseUrl:any;
	apiKey:string = 'AIzaSyCT9DKxctQ44z_tLouXlkWLWTXIL1s0tNI';
  constructor(public http: Http) {
    console.log('Hello Location Provider');
  }

  getNearByPlaces(lat, lng) {
  	this.baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=50&key='+this.apiKey;
  	return this.http.get(this.baseUrl) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  getPlaceDetails(place_Id) {
  	this.baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+place_Id+'&key='+this.apiKey;
  	return this.http.get(this.baseUrl) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }
}
