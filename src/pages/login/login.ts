import { Component } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { MyFeed } from '../myFeed/myFeed';
import { Signup } from '../signup/signup';

import { User } from '../../providers/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[User, Facebook]
})
export class Login {

	public user:any;
  public loginData:any = {'username':'', 'password':''};
  loader = null;
  FB_APP_ID: number = 1318290321592685 ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public userService: User) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
    let user = localStorage.getItem('user');
    if(user != undefined)
    	this.navCtrl.setRoot(MyFeed);
  }

  login(data: any) {
    this.loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Signing in'
    });
    this.loader.present();
    if(data.username == '' || data.password == '') {
      let alert = this.alertCtrl.create({
        title:'Empty Fields',
        subTitle:'All Fields are mandatory.',
        buttons:['OK']
      });
      this.loader.dismiss();
      alert.present();
      return;
    }
    this.userService.signIn(data).subscribe(
      response => {
        console.log(response);
        let user:any = {
          'firstname':response.firstname, 
          'lastname':response.lastname, 
          'username':response.username, 
          'email':response.email,
          '_id':response._id
        };
        localStorage.setItem('user', JSON.stringify(user));
        this.loader.dismiss();
        this.navCtrl.setRoot(MyFeed);
      },
      error => {
        console.error(JSON.parse(error._body).msg)
        let alert = this.alertCtrl.create({
          title:'Error',
          subTitle:JSON.parse(error._body).msg,
          buttons:['OK']
        });
        this.loader.dismiss();
        alert.present();
      }
    );
  }

  signup() {
  	this.navCtrl.push(Signup);
  }

  loginFacebook() {
    let permissions = new Array();
    //the permissions your facebook app needs from the user
    permissions = ["public_profile", 'user_friends', 'email'];
    let nav = this.navCtrl;
    let service = this.userService;
    
  //   this.fb.login(['public_profile', 'user_friends', 'email'])
  // .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
  // .catch(e => console.log('Error logging into Facebook', e));

    this.fb.login(permissions)
    .then((res: FacebookLoginResponse) => {
      console.log('Logged into Facebook!', res)
      let userId = res.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      this.fb.api("/me?fields=name,gender,email", params)
      .then( (user: any) => {
        // user.avatar = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        console.log(user);
        let data;
        service.fb_signIn(data).subscribe(
          response => {
            localStorage.setItem('user', JSON.stringify(user));
            nav.setRoot(MyFeed);
          },
          error => {
            console.error(error)
            let alert = this.alertCtrl.create({
              title:'Error',
              subTitle:JSON.parse(error._body).msg,
              buttons:['OK']
            });
            alert.present();
          }
        );
      })
      .catch(e => console.log('Error logging into Facebook', e));
    });
  }
}
