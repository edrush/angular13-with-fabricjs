import {
  Component,
  OnInit,
} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  output: string[] = [];

  canvas: fabric.Canvas;

  pausePanning = false;

  /*zoomStartScale = 0;
  currentX;
  currentY;
  xChange;
  yChange;
  lastX;
  lastY;*/

  constructor() {
    // Initialization inside the constructor
    this.canvas = new fabric.Canvas('canvas', {});
  }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: '#5b240d',
      width: 1024,
      height: 680,
      selection: false,
    });

    const canvas = this.canvas;

    let group = [];
    fabric.loadSVGFromURL('/assets/castle_small.svg', function () {
        let loadedObjects = new fabric.Group(group);
        loadedObjects.scaleToWidth(150).set({
          left: 10,
          top: 10,
          selectable: false,
        });
        canvas.add(loadedObjects);
        canvas.renderAll();
      },
      function (item, object) {
        object.set('id', item.getAttribute('id'));
        // @ts-ignore
        group.push(object);
    });

    let group2 = [];
    fabric.loadSVGFromURL('/assets/castle_large.svg', function () {
        let loadedObjects = new fabric.Group(group2);
        loadedObjects.scaleToWidth(400).set({
          originX: 'center',
          originY: 'center',
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
        });
        canvas.add(loadedObjects);
        canvas.renderAll();
      },
      function (item, object) {
        object.set('id', item.getAttribute('id'));
        // @ts-ignore
        group2.push(object);
    });

    let group3 = [];
    fabric.loadSVGFromURL('/assets/Logo-signseeing.svg', function () {
        let loadedObjects = new fabric.Group(group3);
        loadedObjects.set({
          originX: 'right',
          originY: 'bottom',
          left: canvas.getWidth() - 10,
          top: canvas.getHeight() - 10,
          selectable: false,
        });
        canvas.add(loadedObjects);
        canvas.renderAll();
      },
      function (item, object) {
        object.set('id', item.getAttribute('id'));
        // @ts-ignore
        group3.push(object);
    });
  }

  onSave(event?: MouseEvent) {
    // @ts-ignore
    event.target.href = this.canvas.toDataURL({
      format: "png"
    });
    // @ts-ignore
    event.target.download = 'canvas.png';
  }

  onPush() {
    const formData = new FormData();
    const canvasBlob = this.getCanvasBlob(this.canvas);
    formData.append('canvasImage', canvasBlob);

    fetch('http://localhost/api/endpoint', {
      method: 'post',
      cache: 'no-cache',
      body: formData
    })
      .then(data => console.log(data))
  }

  getCanvasBlob(canvas: fabric.Canvas) {
    // toDataURL encodes your canvas as a string
    const base64 = canvas.toDataURL();
    return this.dataURItoBlob(base64);
  }

  // https://stackoverflow.com/questions/4998908/
  dataURItoBlob(dataURI: string) {
    const binary = atob(dataURI.split(',')[1]);
    let array: number[] = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }
}
