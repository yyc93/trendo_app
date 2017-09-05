import {Pipe, PipeTransform, } from "@angular/core";
@Pipe({
	name:'encodeURI',
	pure:false
})
export class EncodeURIPipe implements PipeTransform {
	private timer: number;
	constructor() {}
	transform(value:string) {
		return encodeURIComponent(value).replace(/%20/g, '+');
	}
}