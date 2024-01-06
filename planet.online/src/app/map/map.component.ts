import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements OnInit {
  loading = false
  map:any
  currentCoords = {lat:0,long:0}
  @Input() userLocation: any
  userList:any
  constructor(private http:HttpClient, private router:Router) { }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
        
    let newcoords = changes['userLocation'].currentValue;
    
    if(newcoords.long != 0 && this.map){      
      this.map.flyTo([newcoords.lat,newcoords.long],13);
      var circle = L.circle([newcoords.lat,newcoords.long], {
        color: 'blue',
        fillColor: 'white',
        fillOpacity: 0.3,
        radius: 1000
      }).addTo(this.map);
    }
    
    
}
  ngOnInit(): void {
    //default map coords if user don't allow us to get coords

    this.map = L.map('mapid').setView([49.2827, -123.1207], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this.map);
      
      if(this.userLocation.long != 0 && this.userLocation.lat != 0){
        this.map.flyTo([this.userLocation.lat,this.userLocation.long],13);
        var circle = L.circle([this.userLocation.lat,this.userLocation.long], {
          color: 'blue',
          fillColor: 'white',
          fillOpacity: 0.3,
          radius: 1000
        }).addTo(this.map);
      }
  }
  findNearby(){
    this.loading = true;
    this.http.post("/findnearbyusers", {username:this.userLocation.username, city:this.userLocation.city, country:this.userLocation.country}).subscribe(
      (res) => {
        this.loading = false;
        this.userList = (res as any).ids
      },
      (err) => {alert("Error! Please try again");}
      
    );
    
  }
  messageUser(username:string){
    this.router.navigateByUrl('/messages/add', { state: { from: this.userLocation.username, to:username } });
  }
  
}
