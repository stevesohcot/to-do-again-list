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
	public topicCreateUpdate = '';

	public alert: string = '';

	searchText: string = '';

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
					this.topicLoadError = '[Error]';
				}
			);
	}

	topicCreate():void {
		// @@todo - verify/change error msgs
		if (!this.topic.name || this.topic.name == '') {
			console.log('required');
			return;
		}

		this.topicCreateUpdate = '';
		this.topicService.topicCreate(this.topic).then(
			result => {
				if ( result.error) {
					this.topicCreateUpdate = 'There was a problem saving the topic.';
					return;
				}
				//console.log(result);
				this.router.navigateByUrl('/topic/' + result.topicID);
			}).catch(			
				error => {
					this.topicCreateUpdate = 'There was a problem saving the topic.';
				}
			);
	}

}