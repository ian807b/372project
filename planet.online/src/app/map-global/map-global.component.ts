import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-global',
  templateUrl: './map-global.component.html',
  styleUrls: ['./map-global.component.css']
})
export class MapGlobalComponent implements OnInit {
  loading = false
  map:any
  currentCoords = {lat:0,long:0}
  @Input() userLocation: any
  @Input() isGlobal: boolean | undefined
  userList:any
  constructor(private http:HttpClient, private router:Router, private elementRef: ElementRef) { }
 
  ngOnInit(): void {
    
    this.map = L.map('globalmap').setView([0,0], 1.25);
    var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: cartodbAttribution
    }).addTo(this.map);
    this.findAllusers();
  }
  findAllusers(){
    this.http.post("/findallusers",{}).subscribe(
      (res) => {
        
        this.userList = (res as any).ids
        console.log(this.userList);
        this.propogateMarkers(this.userList)

        
      },
      (err) => {alert("Error! No users found");}
      
    );
    
  }

  propogateMarkers(list:any[]){
    list.forEach(user => {
      if(user.lat && user.long){
        L.marker([ user.lat,user.long ], {
          icon: L.icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        }).bindPopup(`<b style="cursor:pointer" class="popup">${user.username}</b><br>${user.city}, ${user.country}`).on('click', (e) =>{
          this.map.flyTo([user.lat,user.long], 13)
          this.elementRef.nativeElement.querySelector(".popup").addEventListener("click", () => {
            this.visitUser(user.username);
          });
          
        }).addTo(this.map);
      }
      
    })

  }

  visitUser(username:string){
    console.log(username);
    
    this.router.navigateByUrl(`/search/${username}`);
  }
  
}

