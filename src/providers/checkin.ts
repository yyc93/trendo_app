import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class Checkin {

	//private baseUrl = 'https://trendo-admin.herokuapp.com/api/';
	private baseUrl = 'http://169.48.179.4/api/';

  constructor(public http: Http) {
    console.log('Hello Checkin Provider');
  }

  userCheckIn(data: Object){
  	let bodyString = data; // Stringify payload

    return this.http.post(this.baseUrl + 'checkin', bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if an
  }

  upload(data: Object, checkin_id: string){
  	let bodyString = data; // Stringify payload

    return this.http.post(this.baseUrl + 'upload/' + checkin_id, bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if an	
  }

  deleteCheckin(id: any){
    return this.http.get(this.baseUrl + 'checkin/delete/' + id) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  getUserCheckIn(user_id: string){
    return this.http.get(this.baseUrl + 'user-checkin/' + user_id) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  getCheckInComments(checkin_id: string) {
    return this.http.get(this.baseUrl + 'comment/' + checkin_id) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  createCheckinComment(comment: string, checkinId: string, userID: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });  //'application/x-www-form-urlencoded'
   
    let body = new FormData();
    body.append('checkin_id', checkinId);
    body.append('commentText', comment);
    body.append('userID', userID);

    return this.http.post(this.baseUrl + 'comment/newpost/', body, headers) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if an	
  }

  getAllPublicCheckIns(){
    return this.http.get(this.baseUrl + 'checkin/public') // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

  followersCheckins(id) {  
    return this.http.get(this.baseUrl + 'connection-checkin/' + id) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if an
  }

}
