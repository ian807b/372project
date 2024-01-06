import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AppService } from "../app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { response } from "express";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{
  loading = false;
  loggedIn = false;
  username: string = "";
  user: any | undefined
  constructor(
    private http: HttpClient,
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.loggedIn = this.service.isLoggedIn();
    this.username = this.service.getUsername();
    if(this.loggedIn){
      navigator.geolocation.getCurrentPosition((position)=> {
        const p=position.coords;
        this.http.post('/user', {username:this.username}).subscribe(
          (res) => {
            this.user = (res as any).ids[0]    
            this.user.lat = p.latitude;
            this.user.long = p.longitude
            if(this.user.city){}
            else{this.updateLocation(this.username)}
        },
          (err) => {
          alert("Error!");
        }) 
      })
    }    
  }
  goToMessages(user:string){
    this.router.navigateByUrl(`/account/${user}/conversations`);
    //this.router.navigate(["./conversations"],{ relativeTo: this.route, state: { data: user } });
  }
  logout(){
    this.http.get("/logout").subscribe(
      (res) => {
        this.service.setLoggedIn(false);
        this.service.setUsername("");
        this.router.navigate(["/home"]);
        sessionStorage.clear();
      },
      (err) => {
        alert("Error!");
      }
    );
  }
  updateLocation(user:string){
    this.loading = true
    navigator.geolocation.getCurrentPosition((position)=> {
      const p=position.coords;
      let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.latitude}&lon=${p.longitude}&zoom=18&addressdetails=1`;
      this.http.get(url).subscribe(data => {
        this.user = {username:this.username,city:(data as any).address.city, country:(data as any).address.country, lat:p.latitude, long:p.longitude}
        let request = {username:user,city:(data as any).address.city, country:(data as any).address.country, lat:p.latitude, long:p.longitude}
        this.http.post("/updatelocation", request).subscribe(res => {    
          this.loading = false;
          alert("Update current location successful")
        }, (err) => {alert("Update current failed")}
        )
      })
    
      
    })
  }

  changePassword(user:string){
    console.log(this.user);
    
    let ref = this.dialog.open(ConfirmationDialogComponent,  {data: {currentPassword:this.user.password}} )
    ref.afterClosed().subscribe(data => {
      console.log(data);
      if(data){
        this.http.post('/updatepassword',{username:user, password:data}).subscribe(response =>{
          console.log(response);
          
          alert('Update successful')
          
        })
      }
      
    })
    
  }
}
