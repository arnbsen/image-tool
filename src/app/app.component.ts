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
  refToMap: Map;
  activeAction = 'add';
  drawAction = '';

  options = {

  };
  firstPoint: [number, number];
  lastDrawRef: any;
  instruction = `Click 'Add' to begin`;
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


  isOpen = true;

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
   console.log(this.refToMap);
  }
  drawPolygon(color: string, polyArray: [number, number][]) {
    this.refToMap.addLayer(L.polygon(polyArray, {
      stroke: true,
      fill: true,
      color
    }));
  }



  onMouseClick(event: LeafletMouseEvent) {
    if (this.drawAction === 'rect') {
      if (this.lastDrawRef) {
          this.lastDrawRef.remove();
      }
      this.lastDrawRef = new L.CircleMarker([event.latlng.lat, event.latlng.lng], {
        radius: 5,
        stroke: true,
        color: '#fff',
        fill: true,
        fillColor: '#fff',
        opacity: 1
      });
      this.refToMap.addLayer(this.lastDrawRef);

    } else if (this.drawAction === 'polygon') {

    } else {

    }

  }

  onMouseMove(event: LeafletMouseEvent) {
    if (this.drawAction === 'rect') {

    } else if (this.drawAction === 'polygon') {

    } else {

    }
  }

  onMouseDown(event: LeafletMouseEvent) {
    if (this.drawAction === 'rect') {

    } else if (this.drawAction === 'polygon') {

    } else {

    }
  }

  undo() {

  }

  redo() {

  }
  toggle() {

  }
}
