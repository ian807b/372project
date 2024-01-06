import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AppService } from "../app.service";
import { Topic } from "./topic.interface";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  subject!:any;
  topic_id!:any;
  content!:any;
  loggedIn = false;
  topics: Topic[] = [];
  username: string = "";

  constructor( 
    private http: HttpClient,
    private service: AppService,
    private router: Router){}

  ngOnInit(): void {
    this.subject="";
    this.topic_id="";
    this.content="";
    this.loggedIn = this.service.isLoggedIn();
    if (this.loggedIn) {
      this.fetchTopics();
    }
    this.username = this.service.getUsername();
  }

  // Calls getTopics() from app.service
  fetchTopics() {
    this.service.getTopics().subscribe(
      (data: any) => {
        this.topics = data.topics;
      },
      (error: HttpErrorResponse) => {
        console.error("Failed to fetch topics:", error);
        console.log("Error status:", error.status);
        console.log("Error message:", error.message);
        console.log("Error response:", error.error);
      }
    );
  }

  addThread(){
    this.service.addThread(
      this.subject,
      this.content,
      this.topic_id
    ).subscribe(
      (response: any) => {
        if (response.status === "success") {
          // @ts-ignore
          this.router.navigateByUrl([response.url]);
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onValueChange($event:any){
    this.content=$event.target.value;
  }

  gotoHome(){
    this.router.navigateByUrl("post");
  }
}
