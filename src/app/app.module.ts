import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { NavigationComponent } from './components/navigation/navigation.component';
import { TopicsComponent } from './views/topics/topics.component';
import { TopicComponent } from './views/topic/topic.component';
import { ItemsComponent } from './views/items/items.component';

import { FilterPipe } from './pipes/filter.pipe';
import { AboutComponent } from './views/about/about.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { LoadingComponent } from './views/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    TopicsComponent,
    NavigationComponent,
    TopicComponent,
    ItemsComponent,
    FilterPipe,
    AboutComponent,
    AutofocusDirective,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
