import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

declare var google: any;

@Component({
    selector: 'modal-autocomplete',
    templateUrl: 'modal-autocomplete.html'
})
export class ModalAutocompleteItems implements OnInit{

    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;
    requestID:number = 0;

    constructor(public viewCtrl: ViewController) { 
    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();        
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        console.log('modal > chooseItem > item > ', item);
        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        this.requestID++;
        console.log("modal > updateSearch > current requestID: ", this.requestID);
        let myRequest = this.requestID;
        let self = this;
        let config = { 
            types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.autocomplete.query, 
            componentRestrictions: { country: 'US' } 
        }
        
        this.acService.getPlacePredictions(config, function (predictions, status) {
            if( myRequest == self.requestID ) {
                console.log('modal > getPlacePredictions > status > ', status);
                let completeItems = [];
                if( predictions == null )  return;
                predictions.forEach(function (prediction) {              
                    completeItems.push(prediction);
                });
                self.autocompleteItems = completeItems;
            }
        });
    }

}
