import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private loggedInStatus = false;
  private username: string = "";

  constructor(private http: HttpClient) {}

  // Setter and getter of the username
  setUsername(username: string): void {
    this.username = username;
    sessionStorage.setItem("username",this.username);
  }

  // Setter and getter of the username
  getUsername(): string {
    //return this.username;
    return String(sessionStorage.getItem("username"));
  }

  // Sets the boolean value true when the user logs in
  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
    sessionStorage.setItem("loggedInStatus",String(this.loggedInStatus));
  }

  // Getter for user login status
  isLoggedIn() {
    //return this.loggedInStatus;
    return Boolean(sessionStorage.getItem("loggedInStatus"));
  }

  // Get the topics (tech, med...etc)
  getTopics() {
    const fullUrl = `/api/topics`;
    return this.http.get(fullUrl);
  }

  fetchPosts(post_id: number) {
    const fullUrl = `/api/posts`;
    return this.http.post(fullUrl, {
      post_id: post_id
    });
  }

  addThread(subject: string, content: string, topic_id: string) {
    return this.http.post("/api/add-thread",{
      subject: subject,
      content: content,
      topic_id: topic_id,
    })
  }

  addPost(topic_id: number, content: string, thread_id: number) {
    const fullUrl = `/api/add-post`;
    return this.http.post(fullUrl, {
      topic_id: topic_id,
      content: content,
      thread_id: thread_id
    });
  }

  deletePost(post_id: number) {
    const fullUrl = `/api/delete-post`;
    return this.http.post(fullUrl, {
      post_id: post_id,
    });
  }

  banUser(user_id: string) {
    const fullUrl = `/api/ban-user`;
    return this.http.post(fullUrl, {
      user_id: user_id,
    });
  }

}
