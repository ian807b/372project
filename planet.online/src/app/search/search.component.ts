import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AppService } from "../app.service";
import { TopicThread } from "./post.inferface";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  loggedIn = false;
  searchedname:any="";
  threads!: TopicThread[];
  user:any | undefined
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private userService:AppService) {}

  ngOnInit(): void {
    this.searchedname= this.route.snapshot.paramMap.get("search_id");
    this.loggedIn = this.userService.isLoggedIn();
    this.http.get(`/search/${this.searchedname}`).subscribe((response: any) => {
      this.threads = response.threads;
      console.log(response.threads);
    });
    this.http.post('/user', {username:this.searchedname}).subscribe(
      (res) => {
        this.user = (res as any).ids[0]
        console.log(this.user);
        
    },
      (err) => {
      alert("Error!");
    })
  }

  goToThread(topic_id: string, index:any) {
    console.log(topic_id);
    console.log(index);
    this.router.navigateByUrl(`/forum/${topic_id}/${this.threads[index].p_post_id}`);
  }

  message(username:string){
    this.router.navigateByUrl('/messages/add', { state: {  to:username } });
  }
}
