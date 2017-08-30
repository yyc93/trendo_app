import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Checkin } from '../../providers/checkin';
import { User } from '../../providers/user';
import { GlobalVars } from '../../providers/global-vars';


@Component({
    selector: 'page-comments',
    templateUrl: 'comments.html'
})
export class CommentsPage {
    checkinId:any = this.navParams.get('id');
    loader = null;
    isEmpty:boolean;
    comment:string;

    public data: any = [];
    public currentUserId:any = this.userProvider.getCurrentUser()._id;
    
    constructor(public navCtrl: NavController
        , public navParams: NavParams
        , public loadingCtrl: LoadingController
        , public userProvider: User
        , public checkinService: Checkin) {

            this.isEmpty = true;
        }

    ionViewDidLoad() {
    	console.log(this.checkinId);
        console.log('ionViewDidLoad CommentsPage');

        this.getAllComment(this.checkinId);
    }
    
    getAllComment (checkinID : string){
        this.loader = this.loadingCtrl.create({
            'spinner': 'dots',
            'content': 'Loading...'
        });
        
        this.checkinService.getCheckInComments(checkinID).subscribe(
            response => {
                this.loader.dismiss();
                console.log(response);
                this.data = [];
                if (response.length == 0) {
                    this.isEmpty = true;
                    return;
                }
                
                this.isEmpty = false;
                for (var i = 0; i < response.length; ++i) {
                    this.data.push(response[i]);
                }
            },
            error => {
                console.error(error);
                this.loader.dismiss();
            }
        );
    }

    newPostComment (comment: string, checkinId: string, userID: string){
        // console.log("newPostComment : ", comment, "checkinId : ", checkinId);
        if( comment.length == 0) return;
        this.loader = this.loadingCtrl.create({
            'spinner': 'dots',
            'content': 'Sending a comment...'
        });

        this.checkinService.createCheckinComment(comment, checkinId, userID).subscribe(
            response => {
                this.loader.dismiss();
                this.comment = "";
                console.log(response);
                this.data.splice(0, 0, response);
                this.isEmpty = false;
            },
            error => {
                console.error(error);
                this.loader.dismiss();
            }
        );
    }

    doRefresh(refresher) {
        this.ionViewDidLoad();

        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 2000);
    }
 }
