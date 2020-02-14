import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { TopicVO } from "../vo/topic-vo";

declare var myExtObject: any;

@Injectable({
  providedIn: 'root'
})

export class TopicService {
	
	public topics: TopicVO[];
	options: object;

	constructor(private http: HttpClient) {
		let optionHeaders : HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		this.options = {headers: optionHeaders};
	}

	getTopics(theType: string) : Promise<any> {
		return myExtObject.getAllTopics(theType);
	}

	getTopicByID(topicID: number) : Promise<any> {
		return myExtObject.getTopicByID(topicID);
	}

	topicCreate(topic :TopicVO): Promise<any> {
		return myExtObject.addTopic(topic.name);
	}

	topicUpdate(topicID: number, topicName: string): Promise<any> {
		return myExtObject.topicUpdate(topicID, topicName);
	}

	topicDelete(topicID: number): Promise<any> {
		return myExtObject.topicDelete(topicID);
	}
}