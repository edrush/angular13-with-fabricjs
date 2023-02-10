import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { fabric } from 'fabric';
import FontFaceObserver from 'fontfaceobserver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  output: string[] = [];

  canvas: fabric.Canvas;

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

    this.loadSVG('/assets/castle_small.svg', canvas, {
      left: 10,
      top: 10,
      selectable: false,
      hoverCursor: 'inherit',
    }, 150);

    this.loadSVG('/assets/castle_large.svg', canvas, {
      originX: 'center',
      originY: 'center',
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
    }, 400);


    this.loadSVG('/assets/Logo-signseeing.svg', canvas, {
      originX: 'right',
      originY: 'bottom',
      left: canvas.getWidth() - 10,
      top: canvas.getHeight() - 10,
      selectable: false,
      hoverCursor: 'inherit',
    });

    const font = new FontFaceObserver('Okta Neue');

    font.load().then(function () {
      const textEditable = new fabric.Textbox(
        'Mehr entdecken. Alles erfahren.', {
          originY: 'bottom',
          left: 10,
          top: canvas.getHeight() - 10,
          width: 500,
          editable: true
        }).set({fill: '#FFF', fontFamily: 'Okta Neue'});

      // Render the Textbox in canvas
      canvas.add(textEditable);
    }).catch(function(e) {
      console.log(e)
    });
  }

  onUpload(event) {
    const file:File = event.target.files[0];
    const canvas = this.canvas;

    if (file) {
      const reader = new FileReader();
      reader.onload = function (f) {
        // @ts-ignore
        const data = f.target.result;
        if ('string' === typeof data) {
          fabric.Image.fromURL(data, function (img) {
            //const oImg = img.set({left: 0, top: 0, angle: 0, width: 500, height: 500}).scale(0.5);
            const oImg = img.scale(0.5);
            img.set({
              originX: 'center',
              originY: 'center',
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
            })
            canvas.add(oImg).renderAll();
          });
        }

      };
      reader.readAsDataURL(file);
    }
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

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'Delete' || event.key === 'Backspace') {
      let activeObject = this.canvas.getActiveObject();
      activeObject&& activeObject.originX === 'center' && this.canvas.remove(activeObject);
    }
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

  loadSVG(path: string, canvas: fabric.Canvas, options: Object, scaleToWidth?: number) {
    let group = [];
    fabric.loadSVGFromURL(path, function (group) {
        let loadedObjects = new fabric.Group(group);
        scaleToWidth && loadedObjects.scaleToWidth(scaleToWidth);
        loadedObjects.set(options);
        canvas.add(loadedObjects);
        canvas.renderAll();
      },
      function (item, object) {
        object.set('id', item.getAttribute('id'));
        // @ts-ignore
        group.push(object);
      });
  }
}
