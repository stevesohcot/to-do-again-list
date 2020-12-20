import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TopicVO } from "../../vo/topic-vo";
import { TopicService } from "../../services/topic.service";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {

	@Input()
	topic :TopicVO;

 	public recentTopics: TopicVO[];
 	public allTopics: TopicVO[];
	public topicLoadError = '';
	public topicAddUpdate = '';

	public alert: string = '';

	searchText: string = '';

	public showTopicError: boolean = false;

	constructor( private topicService:TopicService, 
					private router: Router,
					private activatedRoute: ActivatedRoute,
		) { }
	
	ngOnInit() {
		
		this.alert = this.activatedRoute.snapshot.queryParamMap.get('alert');
		
		if (!this.topic) {
			this.topic = new TopicVO();
		}

		this.getTopics();
	}

	getTopics():void {
		// @@todo - verify/change error msgs
		this.topicLoadError = '';		
		
		this.topicService.getTopics('recent').then(
			result => {
				if (result.error) {
					this.topicLoadError = '[Error]';
					return;
				}
				this.recentTopics = result.resultObject;
			}).catch(
				error => {
					//alert('err recent');
					this.topicLoadError = '[Error]';
				}
			);

		this.topicService.getTopics('all').then(
			result => {
				if (result.error) {
					this.topicLoadError = '[Error]';
					return;
				}
				this.allTopics = result.resultObject;
			}).catch(
				error => {
					//alert('err ALL');

					// error with Safari not loading the data
					//  try again, but only try once (otherwise it'll be an infinite loop)
					this.router.navigateByUrl('/loading');
					this.topicLoadError = '[Error]';
				}
			);

	}

	topicAdd():void {
		// @@todo - verify/change error msgs
		if (!this.topic.name || this.topic.name == '') {
			this.showTopicError = true;
			return;
		}

		this.topicAddUpdate = '';
		this.topicService.topicAdd(this.topic).then(
			result => {
				if ( result.error) {
					this.topicAddUpdate = 'There was a problem saving the topic.';
					return;
				}
				//console.log(result);
				this.router.navigateByUrl('/topic/' + result.topicID);
			}).catch(			
				error => {
					this.topicAddUpdate = 'There was a problem saving the topic.';
				}
			);
	}

}