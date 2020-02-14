import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicsComponent } from './views/topics/topics.component';
import { TopicComponent } from './views/topic/topic.component';
import { ItemsComponent } from './views/items/items.component';

const routes: Routes = [
	{ path: 'all-topics',  component: TopicsComponent },
	{ path: 'topic/:topicID',  component: TopicComponent },
	{ path: 'topic/:topicID/new-item',  component: ItemsComponent },
	{ path: 'item/:itemID',  component: ItemsComponent },
	{ path: '', redirectTo: 'all-topics', pathMatch: 'full' },
	{ path: '**', redirectTo: 'all-topics' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
