import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class User {
  //private baseUrl = 'https://trendo-admin.herokuapp.com/api/';
  private baseUrl = 'http://169.48.179.4/api/';

  constructor(public http: Http) {
    console.log('Hello User Provider');
  }

  signIn(user : Object){

    let bodyString = user; // Stringify payload

    return this.http.post(this.baseUrl + 'userSignin', bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if any
  }

  fb_signIn(user : Object){

    let bodyString = user; // Stringify payload

    return this.http.post(this.baseUrl + 'users/facebookLogin', bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if any
  }

  signUp(user : Object){

    let bodyString = user; // Stringify payload

    return this.http.post(this.baseUrl + 'userSignup', bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if any
  }

  getUserProfile(id) {
    return this.http.get(this.baseUrl + 'users/' + id) // ...using get request
    .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }

  addFriend(data: Object) {
    let bodyString = data; // Stringify payload

    return this.http.post(this.baseUrl + 'users/connect', bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if any
  }

  isLoggedIn(){
    let user = window.localStorage.getItem('user');
    if(user == null)
      return false;

    return true;
  }

  getCurrentUser(){
      return JSON.parse(localStorage.getItem('user'));
  }

  unfriend(data: Object){
    
    let bodyString = data; // Stringify payload

    return this.http.post(this.baseUrl + '/users/unfriend', bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if any
  }

  updateAutoFriend(data: boolean) {
    
    let bodyString = {autoFriend: data};

    return this.http.put(this.baseUrl + '/users/' + this.getCurrentUser()._id, bodyString) // ...using post request
      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error)); //...errors if any
  }

  autoSavePicture(): boolean{
    return JSON.parse(localStorage.getItem('saveToLibrary'));
  }

  setAutoSavePicture(value) {
    JSON.stringify(localStorage.setItem('saveToLibrary', value))
  }

  checkMyPost(): boolean{
    return JSON.parse(localStorage.getItem('notifications'));
  }

  setMyPost(value) {
    JSON.stringify(localStorage.setItem('notifications', value))
  }

}
