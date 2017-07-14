import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MyFeed } from '../pages/myFeed/myFeed';
import { Login } from '../pages/login/login';
import { Settings } from '../pages/settings/settings';
import { FriendList } from '../pages/friend-list/friend-list';
import { _Notification } from '../pages/notification/notification';

import { User } from '../providers/user';

@Component({
  templateUrl: 'app.html',
  providers:[User]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Login;

  pages: Array<{icon:string, title: string, component: any}>;
  name: any;
  loggedIn:boolean = false;

  constructor(public platform: Platform, public userProvider: User) {
    this.initializeApp();
    if(userProvider.isLoggedIn()) {
      this.name = userProvider.getCurrentUser();
      
      if (userProvider.autoSavePicture() == undefined) {
        userProvider.setAutoSavePicture(false);
      }

      if (userProvider.checkMyPost() == undefined) {
        userProvider.setMyPost(false);
      }
    }
    
    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'home', title: 'Home', component: MyFeed },
      { icon: 'alarm', title: 'Notifications', component: _Notification },
      { icon: 'information-circle', title: 'Circle', component: FriendList },
      // { icon: 'checkmark-circle', title: 'Profile Preferences', component: Circle },
      { icon: 'settings', title: 'Profile Preferences', component: Settings }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  signout() {
    localStorage.removeItem('user');
    this.nav.setRoot(this.rootPage);
  }
}
