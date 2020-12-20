import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ItemVO } from "../../vo/item-vo";
import { TopicService } from "../../services/topic.service";
import { ItemService } from "../../services/item.service";

@Component({
	selector: 'app-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.css']
})

// @@todo / potential upgrade:
// for the "get" methods, should I do something like:
// this.items = this.taskModel.tasks = result.resultObject as ItemVO[];

export class TopicComponent implements OnInit {

	public result: object;
	public topicName: string = '';
	public topicLoadError: string = '';
	public itemLoadError: string = '';
	
	public alert: string = '';
	public topicID: number;
	public recentItems: ItemVO[];
	public allItems: ItemVO[];

	public topicAddUpdate: string = '';
	public editable: boolean = false;
	public showOptions: boolean = false;

	searchText: string = '';

	constructor(private topicService:TopicService,
				private itemService:ItemService,
				private activatedRoute: ActivatedRoute,
				private router: Router) { }

	ngOnInit() {
		
		this.alert = this.activatedRoute.snapshot.queryParamMap.get('alert');
		this.topicID = parseFloat( this.activatedRoute.snapshot.paramMap.get('topicID'));
		this.getTopicName(this.topicID);		
		this.getItemsForTopic(this.topicID);
	}

	goToNewItem() {
		this.router.navigate(['/topic/' + this.topicID + '/new-item']);
	}

	getTopicName(topicID: number):void {
		this.topicLoadError = '';
		this.topicService.getTopicByID(topicID).then(
			result => {
				
				if (result.error) {
					this.topicLoadError = result.message;
					return;
				}
				//console.log(result);
				this.result = result.resultObject;
				this.topicName = this.result[0].name;
			}).catch(
				error => {
					this.topicLoadError = '[Error loading the topic name]';
				}
			); 
	}

	getItemsForTopic(topicID: number):void {
		this.itemLoadError = '';

		this.itemService.getItemsForTopic('recent', topicID).then(
			result => {
				if (result.error) {
					this.itemLoadError = 'We could not load any items.';
					return;
				}
				
				this.recentItems = result.resultObject as ItemVO[];
				
			}).catch(
				error => {
					this.itemLoadError = 'We had an error loading the items.';
				}
			);

		this.itemService.getItemsForTopic('all', topicID).then(
			result => {
				if (result.error) {
					this.itemLoadError = 'We could not load any items.';
					return;
				}
				
				this.allItems = result.resultObject as ItemVO[];
				
			}).catch(
				error => {
					this.itemLoadError = 'We had an error loading the items.';
				}
			);
	}

	topicUpdate():void {
	
		if (this.topicName == '') {
			return;
		}

		this.topicAddUpdate = '';
		this.topicService.topicUpdate(this.topicID, this.topicName).then(
			result => {
				if ( result.error) {
					this.topicAddUpdate = 'There was a problem saving the topic.';
					return;
				}
				//console.log(result);
				//this.topicName = result.resultObject[0].topicName;
				this.editable = false;
			}).catch(
				error => {
					this.topicAddUpdate = 'There was a problem saving the topic.';
				}
			);
	}

	topicDelete():void {
	
		var reallyDelete = confirm("Really delete this Topic and all Items associated with it?");

		if (reallyDelete) {

			this.topicAddUpdate = '';
			this.topicService.topicDelete(this.topicID).then(
				result => {
					if ( result.error) {
						this.topicAddUpdate = 'There was a problem deleting the topic.';
						return;
					}
					
					this.router.navigate(['all-topics'], {queryParams: {alert: 'topicDeleted'}});
				}).catch(
					error => {
						this.topicAddUpdate = 'There was a problem deleting the topic.';
					}
				);
		}
	}

}
