// Displays posts within a specific topic selected by the user.

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TopicThread } from "./post.inferface";
import { Router } from "@angular/router";
import { AppService } from "../app.service";

@Component({
  selector: "app-topic-posts",
  templateUrl: "./topic-posts.component.html",
  styleUrls: ["./topic-posts.component.css"],
})
export class TopicPostsComponent implements OnInit {
  topic_id: string = "";
  topic!: TopicThread;
  threads!: TopicThread[];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const topic_id = this.route.snapshot.paramMap.get("topic_id");
    this.http.post(`/api/threads`, {
      topic_id: topic_id
    }).subscribe((response: any) => {
      this.topic = response.topic;
      this.threads = response.threads;
      console.log(this.threads);
    });

  }

  goToThread(topic_id: string,index:any) {
    this.router.navigateByUrl(`/forum/${topic_id}/${this.threads[index].p_post_id}`);
  }
}
