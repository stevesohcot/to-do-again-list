import { Component, OnInit, Input } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {

	@Input() navTopicName: string;
	@Input() navTopicID: number;

	currentUrl: string = '';

	constructor(private router: Router) {

		router.events.subscribe((event: Event) => {
			if (event instanceof NavigationEnd ) {
				this.currentUrl = event.url;
			}
		});

	}

	ngOnInit() {
	}

}