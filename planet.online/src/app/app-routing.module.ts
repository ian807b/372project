import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./account/account.component";
import { AddPostComponent } from "./add-post/add-post.component";
import { LogInComponent } from "./log-in/log-in.component";
import { MapComponent } from "./map/map.component";
import { PostListComponent } from "./post-list/post-list.component";
import { RegisterComponent } from "./register/register.component";
import { TopicPostsComponent } from "./topic-posts/topic-posts.component";
import { PostThreadComponent } from "./post-thread/post-thread.component";
import { MessageAddComponent } from "./messaging/message-add/message-add.component";
import { ConversationListComponent } from "./messaging/conversation-list/conversation-list.component";
import { ConversationComponent } from "./messaging/conversation/conversation.component";
import { SearchComponent } from "./search/search.component";
import { AdminComponent } from "./admin/admin.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: PostListComponent },
  { path: "add", component: AddPostComponent },
  { path: "admin", component: AdminComponent },
  { path: "account/:username", component: AccountComponent, },
  { path: "account/:username/conversations", component: ConversationListComponent, children:[{path:":conv_id", component:ConversationComponent}] },
  { path: "login", component: LogInComponent },
  { path: "register", component: RegisterComponent },
  { path: "post", component:PostListComponent},
  { path: "map", component: MapComponent },
  { path: "messages/add", component: MessageAddComponent },
  { path: "forum/:topic_id", component: TopicPostsComponent },
  { path: "forum/:topic_id/:post_id", component: PostThreadComponent},
  { path: "search/:search_id", component:SearchComponent},
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled'
}

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
