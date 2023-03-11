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

  canvas: fabric.Canvas;
  style = {
    canvas: {
      padding: 40
    }
  }

  constructor() {
    // Initialization inside the constructor
    this.canvas = new fabric.Canvas('canvas', {});
  }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: 1024,
      height: 680,
      selection: false,
    });

    const canvas = this.canvas;

    const outerBorder = new fabric.Rect({
      left: 0,
      top: 0,
      width: this.canvas.getWidth() - 5,
      height: this.canvas.getHeight() - 5,
      fill: '#fff',
      stroke: "#5b240d",
      strokeWidth: 5,
      rx: 30,
      ry: 30,
    });
    canvas.add(outerBorder);

    const innerBorder = new fabric.Rect({
      left: 5,
      top: 5,
      width: this.canvas.getWidth() - 16,
      height: this.canvas.getHeight() - 16,
      fill: '#5b240d',
      stroke: "#fff",
      strokeWidth: 6,
      rx: 30,
      ry: 30,
    });
    canvas.add(innerBorder);

    this.loadSVG('/assets/castle_small.svg', canvas, {
      left: this.style.canvas.padding,
      top: this.style.canvas.padding,
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
      left: canvas.getWidth() - this.style.canvas.padding,
      top: canvas.getHeight() - this.style.canvas.padding,
      selectable: false,
      hoverCursor: 'inherit',
    });

    const font = new FontFaceObserver('Okta Neue');

    font.load().then(() => {
      const textEditable = new fabric.Textbox(
        'Mehr entdecken. Alles erfahren.', {
          originY: 'bottom',
          left: this.style.canvas.padding,
          top: canvas.getHeight() - this.style.canvas.padding,
          width: 500,
          editable: true
        })
        .set({fill: '#FFF', fontFamily: 'Okta Neue', lockMovementX: true, lockMovementY: true, hoverCursor: 'inherit'})
        .setControlsVisibility({
          bl: false,
          br: false,
          ml: false,
          mt: false,
          mr: false,
          mb: false,
          mtr: false,
          tl: false,
        })
      ;

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
            img.scale(0.5);
            img.set({
              originX: 'center',
              originY: 'center',
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
            });
            canvas.width && img.scaleToWidth(canvas.width*0.5);
            canvas.height && img.scaleToHeight(canvas.height*0.5);
            canvas.add(img).renderAll();
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
    event.target.download = 'Schildgrafik.png';
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
        loadedObjects.setControlsVisibility({
          ml: false,
          mt: false,
          mr: false,
          mb: false,
        });
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
