import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { UserDetail } from '../user-detail/user-detail';
import { Business } from '../../providers/business';

@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html'
})
export class PlaceDetail {

	private id: any = this.navParams.get('id');
	public data: any;
	public checkin:any = [];
  public video: string;
	loader = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public business: Business, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
  	console.log(this.id);
  	this.loader = this.loadingCtrl.create({
  		spinner:'dots',
  		content:'Loading details...'
  	});
  	this.loader.present();
  	console.log('ionViewDidLoad PlaceDetailPage');
  	this.business.getBuisenessDetail(this.id).subscribe(
  		response => {
  			console.log(response)
  			this.data = response;
  			this.business.getBuisenessCheckins(this.id).subscribe(
  				response => {
  					console.log(response);
  					for (var i = 0; i < response.length; ++i) {
              if(response[i].fileUrl != undefined)
              {

                var ext = response[i].fileUrl.split(".").pop();
                if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "photo")
                    response[i].fileType = 'image';
                else if (ext == "mp4" || ext == "3gp" || ext == "avi")
                    response[i].fileType = 'video';
                else {
                    response[i].fileType = 'text';
                    console.error("Format Error : This file is not able to show.");
                }

                this.checkin.push(response[i]);
              }
            }
  					this.loadVideo();
  				},
  				error => {
  					console.error(error);
  					let alert = this.alertCtrl.create({
  						title:'<span style="color:red">Error</span>',
  						subTitle:error
  					});
  					this.loader.dismiss();
  					alert.present();
  				}
				);
  		},
  		error => {
  			console.error(error);
  			let alert = this.alertCtrl.create({
  				title:'<span style="color:red">Error</span>',
  				subTitle:error,
  				buttons:['OK']
  			});
  			this.loader.dismiss();
  			alert.present();
  		}
		);
  }

  loadVideo() {
    this.loader.dismiss();
    for (var i = 0; i < this.data.logoImage.length; ++i) {
      var ext = this.data.logoImage[i].substr(this.data.logoImage[i].indexOf('.') + 1); 
      if (ext == 'mp4') {
        this.video = null;
        console.log(ext);
        console.log(this.data.logoImage[i])
        // this.video = 'https://trendo-admin.herokuapp.com/server/uploads/'+this.data.logoImage[i];
        this.video = 'http://169.48.179.4/server/uploads/'+this.data.logoImage[i];
        console.log(this.video)
        return;
      }
    }
  }
  gotoUser(id){
    this.navCtrl.push(UserDetail, {id: id});
  }

}
