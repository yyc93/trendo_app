import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
    selector: 'page-comments',
    templateUrl: 'comments.html'
})
export class CommentsPage {
    id:any = this.navParams.get('id');
    
    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
    	console.log(this.id);
    	console.log('ionViewDidLoad CommentsPage');
  	}
 }
