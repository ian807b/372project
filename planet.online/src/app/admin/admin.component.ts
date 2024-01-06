import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AppService } from "../app.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  banUserForm: FormGroup;
  deletePostForm: FormGroup;
  authorized:any
  constructor(
    private service:AppService,
    private formBuilder:FormBuilder,
    private http:HttpClient,
    private router:Router) {
    this.userCheck()
    
    this.banUserForm = this.formBuilder.group({
      userid: ["", [Validators.required, Validators.minLength(1)]],
    });
    this.deletePostForm = this.formBuilder.group({
      postid: ["", [Validators.required, Validators.minLength(1)]],
    });
  }


  banUserSubmit() {
    const formData = this.banUserForm.value;
    this.service.banUser(formData.userid).subscribe((response: any) => {
      if (response['banned']) {
        alert(`User '${formData.userid}' banned.` )
      } else if (!response['banned']) {
        alert(`User '${formData.userid}' does not exist.` )
      } else {
        alert(response.error)
      }
    });
  }

  deletePostSubmit() {
    const formData = this.deletePostForm.value;
    this.service.deletePost(formData.postid).subscribe((response: any) => {
      if (response['deleted']) {
        alert(`Post '${formData.postid}' deleted.` )
      } else if (!response['banned']){
        alert(`Post '${formData.postid}' does not exist.` )
      } else {
        alert(response.error)
      }
    });
  }
  userCheck(){
    let isLoggedIn = this.service.isLoggedIn()
    let role;
    let user = this.service.getUsername()
    this.http.post('/user', {username:user}).subscribe(
      (res) => {
        role = (res as any).ids[0].role
        if(!isLoggedIn || role != 'a'){
          alert("Unauthorized")
          this.router.navigateByUrl('/home')
        }
        else{
          this.authorized = true;
        }
    },
      (err) => {
      alert("Error!");
    }) 
  }
}
