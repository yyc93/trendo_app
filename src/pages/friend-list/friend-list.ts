import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { User } from '../../providers/user';
import { UserDetail } from '../user-detail/user-detail';

@Component({
  selector: 'page-friend-list',
  templateUrl: 'friend-list.html',
  providers:[User]
})
export class FriendList {

	public friends:any;
	public requests:any;
	public length:any = {friends:'', requests:''};
	loader = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public user: User) {}

  ionViewDidLoad() {
  	this.loader = this.loadingCtrl.create({
  		spinner:'dots',
  		content:'Loading your friends...'
  	});
  	this.loader.present();

    console.log('ionViewDidLoad FriendListPage');
    let user:any = this.user.getCurrentUser();
    this.user.getUserProfile(user._id).subscribe(
    	response => {
    		console.log(response);
    		this.length.friends = response.userConnection.length;
    		this.length.requests = response.connectionRequest.length;
    		this.friends = response.userConnection;
    		this.requests = response.connectionRequest;
    		this.loader.dismiss();
    	},
    	error => {
    		let alert = this.alertCtrl.create({
    			title:'Error',
    			subTitle:error,
    			buttons:['OK']
    		});
    		this.loader.dismiss();
    		alert.present();
    	}
  	);
  }

  unfriend(id){
    this.loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Deleting friend...'
    });
    this.loader.present();
    let data:any = {user_id:JSON.parse(localStorage.getItem('user'))._id, friend_id: id}
    this.user.unfriend(data).subscribe(
      reponse => {
        console.log(reponse);
        this.ionViewDidLoad();
        this.loader.dismiss();
      },
      error => {
        console.log(error);
        let alert = this.alertCtrl.create({
          title:'ERROR!!',
          subTitle:error,
          buttons:['OK']
        });
        this.loader.dismiss();
        alert.present();
      }
    );
  }

  profile(id) {
    console.log(id);
    this.navCtrl.push(UserDetail, {id: id})
  }

}
