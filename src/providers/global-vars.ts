import { Injectable } from '@angular/core';
import { User } from '../providers/user';

@Injectable()
export class GlobalVars {
    public testMode:boolean = false;

    public googleApiKey:string = "AIzaSyAWVNCU73v3per88Ow0m5hCBqH18rU8HT8";
    public categories:any = [
        "amusement_park",
        "aquarium",
        "bar",
        "beauty_salon",
        "bowling_alley",
        "cafe",
        "campground",
        "casino",
        "museum",
        "night_club",
        "park",
        "restaurant",
        "shopping_mall",
        "spa",
        "stadium",
        "university",
        "zoo"
    ];

    public pointedCategories:any = [];
    
    constructor( private userProvider: User){
        if(userProvider.getPointedCategory() == undefined){
            userProvider.setPointedCategory(this.pointedCategories);
        } else {
            this.pointedCategories = userProvider.getPointedCategory();
        }
    }
}