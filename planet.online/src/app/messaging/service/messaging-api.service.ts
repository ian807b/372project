import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as e from 'express';

@Injectable({
  providedIn: 'root'
})
export class MessagingApiService {

  constructor(private http:HttpClient, private route:Router) { }

  addMessage(request:any){
    this.http.post("/addmessage", request).subscribe(
      (res) => {
        if((res as any).result != '-1'){
          alert("Message sent successfully!");
          this.route.navigateByUrl(`/account/${request.user1}/conversations/${(res as any).result}`)
        }
        else{
          alert("Username not found! Please check your spelling and try again!")
        }
        
      },
      (err) => {
        if (err.status === 409) {
          alert("The receiver's username does not exist! Please check your spelling and try again!");
        } else {

          alert("Error! Please try again");

        }
      }
    );
  }
  
  getConversationsAndMessages(request:any):any{
    console.log(request)
    this.http.get("/conversations", request).subscribe(
      (res) => {
        console.log(res)
        return res
      },
      (err) => {
        console.log(err)
        return err
      }
    )
  }
}
