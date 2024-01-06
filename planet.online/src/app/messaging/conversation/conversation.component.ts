import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { MessagingApiService } from '../service/messaging-api.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit{
  loggedIn = false;
  request = {}
  messages:any
  users:any
  toSend:string =''
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private apiService:MessagingApiService, private service:AppService){

  }
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      console.log(param['conv_id']);
      
      this.request = {id:param['conv_id']};
      this.getMessages()
    })
  }

  addMessage(){
    
    if(this.toSend === '\n'){
      alert("Please say something :)")
      return;
    }
    let username = this.service.getUsername()
    let receiver = this.users.sender_name == username ? this.users.receiver_name : this.users.sender_name
    let req = {user1:username, user2:receiver, content:this.toSend}
    this.router.navigateByUrl(`/account/${username}/conversations`)
    this.apiService.addMessage(req)
  }
  getMessages(){
    this.http.post("/messages", this.request).subscribe((response: any) => {
      this.messages = (response as any).ids;
      this.users = (response as any).ids[0];
      this.toSend = ''
    });
  }
}
