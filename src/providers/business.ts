import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class Business {
	//private baseUrl:string = 'https://trendo-admin.herokuapp.com/api/';
	private baseUrl:string = 'http://169.48.179.4/api/';

  constructor(public http: Http) {
    console.log('Hello Business Provider');
  }

  getBuisenessDetail(id) {
  	return this.http.get(this.baseUrl + 'business/59316834c0cc09001144bd64') // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  getBuisenessCheckins(id) {
  	return this.http.get(this.baseUrl + 'business-checkin/' + id) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  getBuisenessAds(){
    return this.http.get(this.baseUrl + 'businessAds/') // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an 
  }

}
