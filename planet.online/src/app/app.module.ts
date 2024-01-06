import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AddPostComponent } from "./add-post/add-post.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AccountComponent } from "./account/account.component";
import { LogInComponent } from "./log-in/log-in.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from "@angular/material/button";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RegisterComponent } from "./register/register.component";
import { HttpClientModule } from "@angular/common/http";
import { TopicPostsComponent } from './topic-posts/topic-posts.component';
import { MapComponent } from './map/map.component';
import { PostThreadComponent } from './post-thread/post-thread.component';
import { ConversationComponent } from './messaging/conversation/conversation.component';
import { MessageAddComponent } from './messaging/message-add/message-add.component';
import { ConversationListComponent } from './messaging/conversation-list/conversation-list.component';
import { SearchComponent } from './search/search.component';
import { AdminComponent } from './admin/admin.component';
import { MapGlobalComponent } from './map-global/map-global.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';


@NgModule({
  declarations: [
    AppComponent,
    AddPostComponent,
    PostListComponent,
    AccountComponent,
    LogInComponent,
    RegisterComponent,
    TopicPostsComponent,
    MapComponent,
    PostThreadComponent,
    ConversationComponent,
    MessageAddComponent,
    ConversationListComponent,
    SearchComponent,
    AdminComponent,
    MapGlobalComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
