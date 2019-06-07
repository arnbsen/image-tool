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
interface RectLabel {startPoint: [number, number]; endPoint: [number, number]; labelColor?: string; }
interface PolygonLabel {coordinates: [number, number][]; labelColor?: string; }

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          opacity: 1
        })
      ),
      state(
        'closed',
        style({
          opacity: 0
        })
      ),
      transition('open => closed', [animate('0.15s')]),
      transition('closed => open', [animate('0.1s')])
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-tool';
  refToMap: Map;
  activeAction = 'chooseshape';
  drawAction = '';
  startPoint: [number, number];
  endPoint: [number, number];
  options = {};
  firstPoint: [number, number];
  lastDrawRef: any;
  instruction = `Click 'Add' to begin`;
  layer = circle([0, 0], 50000000, {
    stroke: true,
    fill: true,
    color: 'red'
  });
  center = L.latLng(0, 0);
  drawLayerBuffer = [];
  drawLayers = [];
  rectLabelLayers: RectLabel[] = [];
  polyLabelLayers: PolygonLabel[] = [];
  currentPolygon: PolygonLabel;
  currentPolyLine: L.Polyline;
  currentPolyStartPoint: L.CircleMarker;
  enablePolyDraw = true;
  drawOptions = {
    draw: true,
    edit: {
      edit: false,
      remove: false
    }
  };
  polyArray = [];
  commonOptions = {
    stroke: true,
    color: '#000',
    fill: true,
    fillColor: '#000',
    fillOpacity: 0.2
  };
  commonPointOption = {
        radius: 5,
        stroke: true,
        color: '#000',
        fill: true,
        fillColor: '#000',
        opacity: 1,
        fillOpacity: 0.2
      };
  isOpen = true;
  polyRemoveCountTemp = 0;
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
    this.refToMap.addLayer(
      L.polygon(polyArray, {
        stroke: true,
        fill: true,
        color
      })
    );
  }

  onMouseClick(event: LeafletMouseEvent) {
    if (this.drawAction === 'rect') {
      if (!this.startPoint) {
        this.startPoint = [event.latlng.lat, event.latlng.lng];
      } else {
        this.drawLayerBuffer.push(
          L.rectangle([this.startPoint, [event.latlng.lat, event.latlng.lng]], this.commonOptions)
        );
        this.lastDrawRef.remove();
        this.rectLabelLayers.push({
          startPoint: this.startPoint,
          endPoint: [event.latlng.lat, event.latlng.lng]
        });
        this.lastDrawRef = undefined;
        this.startPoint = undefined;
      }
      const marker = new L.CircleMarker(
        [event.latlng.lat, event.latlng.lng],
        this.commonPointOption
      );
      this.drawLayerBuffer.push(marker);
    } else if (this.drawAction === 'polygon') {
        if (!this.currentPolyLine) {
            if (this.enablePolyDraw) {
                this.currentPolyLine = L.polyline([
                [event.latlng.lat, event.latlng.lng]
              ], this.commonOptions);
                this.drawLayerBuffer.push(this.currentPolyLine);
                const marker = new L.CircleMarker(
                [event.latlng.lat, event.latlng.lng],
                this.commonPointOption
              ).bindTooltip('Click to Complete polygon').addOneTimeEventListener('click', () => {
                this.enablePolyDraw = false;
                const coordinates = this.currentPolyLine.getLatLngs();
                this.drawLayerBuffer.push(L.polygon(coordinates, this.commonOptions));
                this.currentPolyLine = undefined;
                marker.unbindTooltip();
                this.polyLabelLayers.push(this.currentPolygon);
                this.currentPolygon = undefined;
              });
                this.drawLayerBuffer.push(marker);
              }
            this.currentPolygon = {
                coordinates: [
                  [event.latlng.lat, event.latlng.lng]
                ]
              };
          } else {
              this.currentPolygon.coordinates.push([
                event.latlng.lat,
                event.latlng.lng
              ]);
              this.currentPolyLine.addLatLng([
                event.latlng.lat,
                event.latlng.lng
              ]);
              const marker = new L.CircleMarker(
                [event.latlng.lat, event.latlng.lng],
                this.commonPointOption);
              this.drawLayerBuffer.push(marker);
        }
    } else {
    }
  }
  removeLastShape() {
    if (this.drawAction === 'rect') {
      this.drawLayerBuffer.pop();
      this.drawLayerBuffer.pop();
      this.drawLayerBuffer.pop();
    } else if (this.drawAction === 'polygon') {
        this.currentPolygon.coordinates.pop();
        this.drawLayerBuffer.pop();
        this.currentPolyLine.setLatLngs(this.currentPolygon.coordinates);
    }
  }

  onMouseMove(event: LeafletMouseEvent) {
    if (this.drawAction === 'rect') {
      if (this.lastDrawRef) {
        this.lastDrawRef.remove();
      }
      if (this.startPoint) {
        this.lastDrawRef = L.rectangle(
          [this.startPoint, [event.latlng.lat, event.latlng.lng]],
          this.commonOptions
        );
        this.refToMap.addLayer(this.lastDrawRef);
      }
    } else if (this.drawAction === 'polygon') {
        this.enablePolyDraw = true;
    } else {
    }
  }

  toggle() {}

  putLabels(labelColor: string) {
    this.rectLabelLayers.forEach(label => {
      if (!label.labelColor) {
        label.labelColor = labelColor;
      }
    });
    this.polyLabelLayers.forEach(label => {
       if (!label.labelColor) { label.labelColor = labelColor; }
    });
    this.refreshDrawLayers();
    this.activeAction = 'chooseshape';
  }

  refreshDrawLayers() {
    this.drawLayerBuffer = [];
    this.rectLabelLayers.forEach((label: RectLabel) => {
      this.drawLayers.push(
        L.rectangle([label.startPoint, label.endPoint], {
          stroke: true,
          color: label.labelColor,
          fill: true,
          fillColor: label.labelColor,
          opacity: 1,
          fillOpacity: 0.2
        })
      );
    });
    this.polyLabelLayers.forEach((label: PolygonLabel) => {
      this.drawLayers.push(
        L.polygon(label.coordinates, {
          stroke: true,
          color: label.labelColor,
          fill: true,
          fillColor: label.labelColor,
          opacity: 1,
          fillOpacity: 0.2
        })
      );
    });
  }
}
