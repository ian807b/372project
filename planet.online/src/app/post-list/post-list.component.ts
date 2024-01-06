// This component should've really called topic-list.
// But anyway, it displays the Topics (ot, fin, fit, med, tech)
// when the user logs in to the application.
// This component is '/home' in the Angular route.

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppService } from '../app.service';
import { Topic } from './topic.interface';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [animate('2s ease-in')]),
    ]),
  ],
})
export class PostListComponent implements OnInit {
  loggedIn = false;
  topics: Topic[] = [];
  username: string = '';
  constructor(
    private http: HttpClient,
    private service: AppService,
    private router: Router
  ) {}

  ngOnInit() {
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
        console.error('Failed to fetch topics:', error);
        console.log('Error status:', error.status);
        console.log('Error message:', error.message);
        console.log('Error response:', error.error);
      }
    );
  }

  goToTopic(topic_id: string) {
    this.router.navigateByUrl(`/forum/${topic_id}`);
  }
}
