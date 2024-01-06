import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessagingApiService } from '../service/messaging-api.service';
import { AppService } from "../../app.service";

@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.css']
})
export class MessageAddComponent implements OnInit{
  loggedIn = false;
  request = {user1:"", user2:"", content:""}

  constructor(private http:HttpClient,private service: AppService,  private apiService:MessagingApiService){
    this.request.user1 = window.history.state.from || this.service.getUsername()
    this.request.user2 = window.history.state.to || ""
  }
  ngOnInit(): void {
    this.loggedIn = this.service.isLoggedIn();
  }
  addMessage(){
    this.apiService.addMessage(this.request)
  }
}

