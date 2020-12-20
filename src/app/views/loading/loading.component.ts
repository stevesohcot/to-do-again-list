import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  	// Sometimes Safari doesn't load the database;
  	// send them to this screen
  	// and then redirect

	let timer = setTimeout(
			() : void => {
				this.router.navigateByUrl('');
			},
			2000
		);

  }

}
