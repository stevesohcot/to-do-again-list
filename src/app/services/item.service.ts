import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ItemVO } from "../vo/item-vo";

declare var myExtObject: any;

@Injectable({
  providedIn: 'root'
})

export class ItemService {

	public items: ItemVO[];
	options: object;

	constructor(private http: HttpClient) {
		let optionHeaders : HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		this.options = {headers: optionHeaders};
	}

	getItemsForTopic(theType: string, topicID: number) : Promise<any> {
		return myExtObject.getItemsForTopic(theType, topicID);
	}

	getItemByID(itemID: number) : Promise<any> {
		return myExtObject.getItemByID(itemID);
	}

	itemAdd(item :ItemVO): Promise<any> {
		// "item" is already an object; pass it in as-is
		return myExtObject.itemAdd(item);
	}
	
	itemUpdate(item :ItemVO): Promise<any> {
		return myExtObject.itemUpdate(item);
	}

	itemDelete(itemID: number): Promise<any> {
		return myExtObject.itemDelete(itemID);
	}
}
