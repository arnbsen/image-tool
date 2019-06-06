import { Component, ViewChild, HostBinding} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { tileLayer, latLng, Map, circle, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import * as L from 'leaflet';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.15s')
      ]),
      transition('closed => open', [
        animate('0.1s')
      ]),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-tool';
  @ViewChild('leafletInstance', {static: true}) leafletInstance: LeafletDirective;
  refToMap: Map;
  mouseDown = false;
  lastRef: any;
  div1Disapper = true;
  options = {
   
  };
  firstPoint : [number, number];

  layer = circle([0, 0], 50000000, {
    stroke: true,
    fill: true,
    color: 'red'});
  center = L.latLng(0, 0);
  layers = [

  ];
  drawOptions = {
    draw: true,
    edit: {
      edit: false,
      remove: false
    }
  };
  polyArray = [];

  onMapReady(map: Map) {
    console.log(map.getBounds());
    L.imageOverlay('../assets/Street1.jpg', map.getBounds()).addTo(map);
    console.log(map);
    this.refToMap = map;
  }




  addLayer(event: any) {
    console.log(event);
  }
  getMap() {
   console.log(this.leafletInstance);
   console.log(this.refToMap);
  }
  drawPolygon(color: string) {
    console.log(this.polyArray);
    this.refToMap.addLayer(L.polygon(this.polyArray, {
      stroke: true,
      fill: true,
      color
    }));
    this.polyArray = [];
  }

  onMouseClick(event: LeafletMouseEvent) {
      console.log(event.latlng);
      this.polyArray.push([event.latlng.lat, event.latlng.lng ]);
      this.refToMap.addLayer(new L.CircleMarker(
        [event.latlng.lat, event.latlng.lng], {
          radius: 5,
          stroke: true,
          color: '#fff',
          fill: true,
          fillColor: '#fff',
          opacity: 1
        }).bindTooltip('Click to complete Polygon').addEventListener('click', () => {
            this.drawPolygon('#000');
        }));
  }

  onMouseMove(event: LeafletMouseEvent) {
    if(this.mouseDown) {
      if(this.lastRef) {
        this.lastRef.remove();
      }
      this.lastRef = L.rectangle([this.firstPoint, [event.latlng.lat, event.latlng.lng ] ], {
        stroke: true,
            color: '#000',
            fill: true,
            fillColor: '#000',
            opacity: 0.5
      })
      this.refToMap.addLayer(this.lastRef);
    }
    
  }

  onMouseDown(event: LeafletMouseEvent) {
      this.mouseDown = true;
      this.firstPoint = [event.latlng.lat, event.latlng.lng ];
  }


  isOpen = true;
 
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
