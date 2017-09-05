import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FilterLocation } from '../filter-location/filter-location';
import { MyFeed } from '../myFeed/myFeed';
import { GlobalVars } from '../../providers/global-vars';
import { User } from '../../providers/user';


@Component({
  selector: 'page-filter-category',
  templateUrl: 'filter-category.html',
  providers: [GlobalVars]
})
export class FilterCategory {
	id:any = this.navParams.get('id');
  show:number = 1;
  categories = [];
  checkedAll : boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public globalVars: GlobalVars) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterCategoryPage');
    let numCheckedCategory = 0;
    for( let categoryName of this.globalVars.categories){
      let category = {
        name : '',
        checked : false
      }
      category.name = categoryName;
      for( let item of this.globalVars.pointedCategories ){
        if( category.name == item){
          category.checked = true;
          numCheckedCategory++;
          break;
        }
      }
      this.categories.push(category);
    }

    if( numCheckedCategory == this.globalVars.categories.length)
      this.checkedAll = true;
  }

  goto(num) {
  	if(num == 1){
  		this.navCtrl.push(FilterLocation, { id: num});
  	}
  	if(num == 2){ 
  		return;	
  	}
	}

  close(isSave){
    if(isSave==1)
      this.saveCheckedCategory();
    this.navCtrl.setRoot(MyFeed);
  }

  selectAllCategory() {
    if( this.checkedAll ){
      for( let item of this.categories ){
        item.checked = true;
      }
    } else {
      for( let item of this.categories ){
        item.checked = false;
      }
    }
    this.updateCheckCategory();
  }

  addToCategoryList(category) {
    this.updateCheckCategory();
  }

  updateCheckCategory() {
    let checkedCategoryName = [];
    let numCheckedItem:number = 0;
    for( let item of this.categories){
      if( item.checked ){
        checkedCategoryName.push(item.name);
        numCheckedItem++;
      }
    }
    if( numCheckedItem == this.globalVars.categories.length ){
      this.checkedAll = true;
    } else {
      this.checkedAll = false;
    }
  }

  saveCheckedCategory(){
    let checkedCategoryName = [];
    for( let item of this.categories){
      if( item.checked )
        checkedCategoryName.push(item.name);
    }
    this.globalVars.pointedCategories = checkedCategoryName;
    this.user.setPointedCategory(this.globalVars.pointedCategories);
  }
}
