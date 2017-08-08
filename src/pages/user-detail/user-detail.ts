import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PlaceDetail } from '../place-detail/place-detail';
import { User } from '../../providers/user';

@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
  providers:[User]
})
export class UserDetail {

  private id:number = this.navParams.get('id');
  public user:any;
  public userConnectionsLength:number;
  public friendBtn:boolean = true;
  public current:any = this.userProvider.getCurrentUser()._id;
  loader = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public userProvider: User) {}
  
  ionViewDidLoad() {
    this.loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Loading user data...'
    });
    this.loader.present();
    console.log('ionViewDidLoad UserDetailPage');
    console.log(this.id);
    this.userProvider.getUserProfile(this.id).subscribe(
      response => {
        console.log(response);
        this.user = response;
        for( var item of this.user.userCheckins){
          if(item.fileUrl != undefined)
          {
            var ext = item.fileUrl.split(".").pop();
            if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "photo")
                item.fileType = 'image';
            else if (ext == "mp4" || ext == "3gp" || ext == "avi")
                item.fileType = 'video';
            else {
                item.fileType = 'text';
                console.error("Format Error : This file is not able to show");
            }
          }
        }
        this.userConnectionsLength = response.userConnection.length;
        if(this.id == this.current) {
          this.friendBtn = false;
        }
        this.loader.dismiss();
      },
      error => {
        console.log(error);
        this.loader.dismiss();
        let alert = this.alertCtrl.create({
          title:'ERROR!!',
          subTitle:error,
          buttons:['OK']
        });
        alert.present();
      }
    );
  }

  gotoDetails(id){
		this.navCtrl.push(PlaceDetail, {id: id});
	}

  becomeFriend(){
    this.loader = this.loadingCtrl.create({
      spinner:'dots',
      content:'Checking your friend list...'
    });
    this.loader.present();
    this.userProvider.getUserProfile(this.current).subscribe(
      response => {
        for (var i = 0; i < response.userConnection.length; ++i) {
          if(this.user._id == response.userConnection[i]._id) {
            let alert = this.alertCtrl.create({
              title:'Already a friend',
              subTitle:'Cannot send request.',
              buttons:['OK']
            });
            this.loader.dismiss();
            alert.present();
            return;
          }
        }
        this.loader.dismiss();
        let alert = this.alertCtrl.create({
        subTitle:'Are you sure to become fan of'+ ' ' +this.user.username+'?',
        buttons:[
          {
            text:'YES',
            handler: data => {
              this.loader = this.loadingCtrl.create({
                spinner:'dots',
                content:'Sending friend request...'
              });
              this.loader.present();
              let my_id = JSON.parse(localStorage.getItem('user'))._id;
              let request:any = {'user_id':my_id, 'friend_id':this.user._id}
              this.userProvider.addFriend(request).subscribe(
                reponse => {
                  console.log(reponse);
                  this.loader.dismiss();
                },
                error => {
                  console.log(error);
                }
              );
            }  
          },
          {
            text:'NO'
          }
        ]
      });
      alert.present();
      },
      error => {

      }
    );
  }

}
