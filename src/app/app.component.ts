import { Component, ViewChild} from '@angular/core';
import { tileLayer, latLng, Map, circle, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import * as L from 'leaflet';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-tool';
  @ViewChild('leafletInstance', {static: true}) leafletInstance: LeafletDirective;
  refToMap: Map;
  customMarker = L.Icon.extend({
    options: {
      shadowUrl: null,
      iconAnchor: new L.Point(12, 12),
      iconSize: new L.Point(24, 24),
      iconUrl: 'http://joshuafrazier.info/images/firefox.svg'
    }
  });
  options = {
    marker: {
      icon: this.customMarker
    }
  };


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
    },
    marker: {
      icon: this.customMarker
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
}
