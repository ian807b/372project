import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'planet-online';

  constructor(private apiService:AppService, private router: Router){}

  account(){
    let user = this.apiService.getUsername()
    this.router.navigateByUrl(`/account/${user}`);
  }
  message(){
    this.router.navigateByUrl(`/messages/add`);
  }
  search(){
    var sr=(<HTMLInputElement>document.getElementById("search")).value;
    this.router.navigateByUrl(`/search/${sr}`);
  }
}
