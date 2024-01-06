import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MessagingApiService } from '../service/messaging-api.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent {
  userName = {}
  conversationList: any = [];
  state$: Observable<any> | undefined;
  selected:any
  currentUser:string = ""
  constructor(private apiService:MessagingApiService, private route:ActivatedRoute, private http:HttpClient, private router: Router){}
  ngOnInit() {
    this.currentUser  = this.route.snapshot.paramMap.get("username") as string;

    this.http.get("/conversations", this.userName).subscribe(
      (res) => {
        let temp:any  = res
        this.conversationList = temp.rows
      },
      (err) => {
        console.log(err)
      }
    )
    
  }

  selectConv(id:any){
    this.selected = id;
    this.router.navigateByUrl(`account/${this.currentUser}/conversations/${id}`);
    
  }
  addMessage(){
    this.router.navigateByUrl(`/messages/add`);
  }
}
