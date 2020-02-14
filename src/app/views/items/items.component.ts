import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemVO } from "../../vo/item-vo";
import { ItemService } from "../../services/item.service";
import { TopicService } from "../../services/topic.service";


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {

	@Input()
	item :ItemVO;

	//public item: ItemVO;
	public itemLoadError: string = '';
	public itemNotificationError: string = '';
	
	
	public itemID: number;
	public topicID: number;
	navTopicName: string;
	navTopicID: number;

	constructor(private itemService:ItemService,
				private topicService: TopicService,
				private activatedRoute: ActivatedRoute,
				private router: Router) { }

	ngOnInit() {
		
		this.itemID = parseFloat( this.activatedRoute.snapshot.paramMap.get('itemID') );	
		this.topicID = parseFloat( this.activatedRoute.snapshot.paramMap.get('topicID') );	

		this.item = new ItemVO();
		
		if (this.itemID > 0) {
			this.item.id = this.itemID;
			this.getItemInfo(this.itemID);
		} else {
			// used to redirect back upon saving for a NEW entry
			this.item.topicID = this.topicID;
			this.getTopicName(this.item.topicID);
		}
	}

	goToTopicHome() {
		// used in "cancel" of adding a new item
		this.router.navigate(['/topic/' + this.topicID]);
	}

	getItemInfo(itemID: number):void {
		this.itemLoadError = '';
		this.itemService.getItemByID(itemID).then(
			result => {
				if (result.error) {
					this.itemLoadError = 'We could not load any items.';
					return;
				}
				//this.items = this.taskModel.tasks = result.resultObject as ItemVO[];
				console.log(result);
				this.item = result.resultObject[0] as ItemVO;

				this.topicID = this.item.topicID; // used to redirect upon delete
				this.getTopicName(this.item.topicID); // used to display in nav

			}).catch(
				error => {
					this.itemLoadError = 'We had an error loading the items.';
				}
			);
	}

	itemAddUpdate(item: ItemVO):void {
		// @@todo - verify/change error msgs

		if (!item.name || item.name == ''){
			//console.log('required');
			return;
		}

		if (item.rating < 1 || item.rating > 5) {
			item.rating = 3;
		}

		this.itemNotificationError = '';

		if (typeof item.id === 'undefined') {

			// Add item
			this.itemService.itemAdd(item).then(
				result => {
					if ( result.error) {
						this.itemNotificationError = 'There was a problem saving the item.';
						return;
					}

					this.router.navigate(['/topic/' + result.topicID]);

				}).catch(
				
					error => {
						this.itemNotificationError = 'There was a problem saving the item.';
					}
				);

		} else {

			// Update item
			this.itemService.itemUpdate(item).then(
			result => {
				if ( result.error) {
					this.itemNotificationError = 'There was a problem saving the item.';
					return;
				}
				
				this.router.navigateByUrl('/topic/' + result.topicID);

			}).catch(
			
				error => {
					this.itemNotificationError = 'There was a problem saving the item.';
				}
			);
		}
	}

	itemDelete():void {

		this.itemNotificationError = '';
		this.itemService.itemDelete(this.item.id).then(
			result => {
				if ( result.error) {
					this.itemNotificationError = 'There was a problem deleting the topic.';
					return;
				}
				
				this.router.navigateByUrl('/topic/' + this.topicID + '?alert=itemDeleted');
			}).catch(
				error => {
					this.itemNotificationError = 'There was a problem deleting the topic.';
				}
			);
	}

	getTopicName(topicID: number):void {
		//this.topicLoadError = '';
		this.topicService.getTopicByID(topicID).then(
			result => {
				
				if (result.error) {
					//this.topicLoadError = result.message;
					return;
				}
				//console.log(result);
				this.navTopicName = result.resultObject[0].name;
				this.navTopicID = topicID;
			}).catch(
				error => {
					//this.topicLoadError = '[Error loading the topic name]';
				}
			); 
	}

}
