import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { MediaCapture } from '@ionic-native/media-capture';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { TimeAgoPipe } from 'time-ago-pipe';

import { MyApp } from './app.component';
import { MyFeed } from '../pages/myFeed/myFeed';
import { Fans } from '../pages/fans/fans';
import { PlaceDetail } from '../pages/place-detail/place-detail';
import { UserDetail } from '../pages/user-detail/user-detail';
import { LocationPage } from '../pages/location/location';
import { SearchPeople } from '../pages/search-people/search-people';
import { SearchPlaces } from '../pages/search-places/search-places';
import { FilterCategory } from '../pages/filter-category/filter-category';
import { FilterLocation } from '../pages/filter-location/filter-location';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { CheckIn } from '../pages/check-in/check-in';
import { HaversineService } from "ng2-haversine";
import { Settings } from '../pages/settings/settings';
import { FriendList } from '../pages/friend-list/friend-list';
import { _Notification } from '../pages/notification/notification';
import { MyCheckIns } from '../pages/my-check-ins/my-check-ins';
import { CommentsPage } from '../pages/comments/comments';


import { Business } from '../providers/business';
import { Checkin } from '../providers/checkin';
import { LocationP } from '../providers/location';
import { User } from '../providers/user';

@NgModule({
  declarations: [
    MyApp,
    MyFeed,
    Fans,
    PlaceDetail,
    UserDetail,
    LocationPage,
    SearchPeople,
    SearchPlaces,
    FilterCategory,
    FilterLocation,
    Login,
    Signup,
    CheckIn,
    Settings,
    FriendList,
    _Notification,
    MyCheckIns,
    CommentsPage,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCT9DKxctQ44z_tLouXlkWLWTXIL1s0tNI'})
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyFeed,
    Fans,
    PlaceDetail,
    UserDetail,
    LocationPage,
    SearchPeople,
    SearchPlaces,
    FilterCategory,
    FilterLocation,
    Login,
    Signup,
    CheckIn,
    Settings,
    FriendList,
    _Notification,
    MyCheckIns,
    CommentsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, HaversineService, LocationP, User, Checkin, Business, Camera, MediaCapture,Geolocation]
})
export class AppModule {}
