import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
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

  /*pausePanning = false;
  zoomStartScale = 0;
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
      backgroundColor: '#232323',
      width: 400,
      height: 400,
      selection: false,
    });

    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red',
    });
    this.canvas.add(rect);

    fabric.Image.fromURL('https://i.pinimg.com/originals/ed/55/22/ed55223749f1d995b2bb0cbb24692c1d.jpg', (img) => {
      img.scale(0.5).set({
        left: 150,
        top: 100
      });
      this.canvas.add(img);
    });

    /*this.canvas.on('touch:gesture', e => {
      //this.output.push(`touch:gesture (${e.e.touches.length})`);
      if (e.e.touches && e.e.touches.length == 2) {
        this.pausePanning = true;
        var point = new fromFabric.fabric.Point(e.self.x, e.self.y);
        if (e.self.state == "start") {
          this.zoomStartScale = this.canvas.getZoom();
        }
        var delta = this.zoomStartScale * e.self.scale;
        this.canvas.zoomToPoint(point, delta);
        this.output.push(`zoom`);
        this.pausePanning = false;
      }
    });

    this.canvas.on('selection:created', e => {
      this.output.push(`selection:created`);
      this.pausePanning = true;
    });

    this.canvas.on('selection:cleared', e => {
      this.output.push(`selection:cleared`);
      this.pausePanning = false;
    });

    this.canvas.on('touch:drag', e => {
      //this.output.push(`touch:drag`);
      if (this.pausePanning == false && undefined != e.self.x && undefined != e.self.y) {
        this.currentX = e.self.x;
        this.currentY = e.self.y;
        this.xChange = this.currentX - this.lastX;
        this.yChange = this.currentY - this.lastY;

        if( (Math.abs(this.currentX - this.lastX) <= 50) && (Math.abs(this.currentY - this.lastY) <= 50)) {
          var delta = new fromFabric.fabric.Point(this.xChange, this.yChange);
          this.canvas.relativePan(delta);
          this.output.push(`pan`);
        }

        this.lastX = e.self.x
        this.lastY = e.self.y;
      }
    });

    this.canvas.on('mouse:wheel', opt => {
      this.output.push(`ss`);
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      this.canvas.requestRenderAll();
    });

    /*this.canvas.on({
      'touch:gesture': function() {
        var text = document.createTextNode(' Gesture ');
        info.insertBefore(text, info.firstChild);
      },
      'touch:drag': function() {
        var text = document.createTextNode(' Dragging ');
        info.insertBefore(text, info.firstChild);
      },
      'touch:orientation': function() {
        var text = document.createTextNode(' Orientation ');
        info.insertBefore(text, info.firstChild);
      },
      'touch:shake': function() {
        var text = document.createTextNode(' Shaking ');
        info.insertBefore(text, info.firstChild);
      },
      'touch:longpress': function() {
        var text = document.createTextNode(' Longpress ');
        info.insertBefore(text, info.firstChild);
      }
    });*/
  }

  /*grid = 50;
  isDragging = false;
  lastPosX = null;
  lastPosY = null;
  pausePanning = false;
  zoomStartScale = null;
  lastX;
  lastY;

  sensors = [{ id: 'a1' }, { id: 'b2' }, { id: 'c3' }];

  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;

  constructor() {}

  ngOnInit() {
    this.canvas = new fromFabric.fabric.Canvas('c', {
      //centeredScaling: true,
      backgroundColor: '#ccc',
      selection: false,
      renderOnAddRemove: false,
      stateful: false,
      //isDrawingMode: true,
      fireMiddleClick: true,
    });

    this.canvas.setHeight(500);
    this.canvas.setWidth(500);

    this.createGrid();
    this.addEventListeners();

    this.sensors.forEach((sensor) => {
      this.addSensor(sensor);
    });

    this.canvas.getObjects().forEach(o => {
        console.log(o.name);
    });
  }

  createGrid(): void {
    for (var i = 0; i < 600 / this.grid; i++) {
      this.canvas.add(
        new fromFabric.fabric.Line([i * this.grid, 0, i * this.grid, 500], {
          stroke: '#bbb',
          selectable: false,
        })
      );
      this.canvas.add(
        new fromFabric.fabric.Line([0, i * this.grid, 500, i * this.grid], {
          stroke: '#bbb',
          selectable: false,
        })
      );
    }
  }

  addEventListeners(): void {
    this.canvas.on('object:moving', (options) => {
      options.target.set({
        left: Math.round(options.target.left / this.grid) * this.grid,
        top: Math.round(options.target.top / this.grid) * this.grid,
      });
    });

    this.canvas.on('object:scaling', (options) => {
      var target = options.target,
        w = target.width * target.scaleX,
        h = target.height * target.scaleY,
        snap = {
          // Closest snapping points
          top: Math.round(target.top / this.grid) * this.grid,
          left: Math.round(target.left / this.grid) * this.grid,
          bottom: Math.round((target.top + h) / this.grid) * this.grid,
          right: Math.round((target.left + w) / this.grid) * this.grid,
        },
        threshold = this.grid,
        dist = {
          // Distance from snapping points
          top: Math.abs(snap.top - target.top),
          left: Math.abs(snap.left - target.left),
          bottom: Math.abs(snap.bottom - target.top - h),
          right: Math.abs(snap.right - target.left - w),
        },
        attrs = {
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          top: target.top,
          left: target.left,
        };
      switch (target['__corner']) {
        case 'tl':
          if (dist.left < dist.top && dist.left < threshold) {
            attrs.scaleX = (w - (snap.left - target.left)) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
            attrs.top = target.top + (h - target.height * attrs.scaleY);
            attrs.left = snap.left;
          } else if (dist.top < threshold) {
            attrs.scaleY = (h - (snap.top - target.top)) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
            attrs.left = attrs.left + (w - target.width * attrs.scaleX);
            attrs.top = snap.top;
          }
          break;
        case 'mt':
          if (dist.top < threshold) {
            attrs.scaleY = (h - (snap.top - target.top)) / target.height;
            attrs.top = snap.top;
          }
          break;
        case 'tr':
          if (dist.right < dist.top && dist.right < threshold) {
            attrs.scaleX = (snap.right - target.left) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
            attrs.top = target.top + (h - target.height * attrs.scaleY);
          } else if (dist.top < threshold) {
            attrs.scaleY = (h - (snap.top - target.top)) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
            attrs.top = snap.top;
          }
          break;
        case 'ml':
          if (dist.left < threshold) {
            attrs.scaleX = (w - (snap.left - target.left)) / target.width;
            attrs.left = snap.left;
          }
          break;
        case 'mr':
          if (dist.right < threshold)
            attrs.scaleX = (snap.right - target.left) / target.width;
          break;
        case 'bl':
          if (dist.left < dist.bottom && dist.left < threshold) {
            attrs.scaleX = (w - (snap.left - target.left)) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
            attrs.left = snap.left;
          } else if (dist.bottom < threshold) {
            attrs.scaleY = (snap.bottom - target.top) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
            attrs.left = attrs.left + (w - target.width * attrs.scaleX);
          }
          break;
        case 'mb':
          if (dist.bottom < threshold)
            attrs.scaleY = (snap.bottom - target.top) / target.height;
          break;
        case 'br':
          if (dist.right < dist.bottom && dist.right < threshold) {
            attrs.scaleX = (snap.right - target.left) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
          } else if (dist.bottom < threshold) {
            attrs.scaleY = (snap.bottom - target.top) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
          }
          break;
      }
      target.set(attrs);
    });

    this.canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      this.canvas.requestRenderAll();
    });

    this.canvas.on('mouse:down', (opt) => {
      opt.e.preventDefault();
      var evt = opt.e;
      if (opt.button === 2) {
        this.isDragging = true;
        this.canvas.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    this.canvas.on('mouse:move', (opt) => {
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.canvas.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.canvas.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    this.canvas.on('mouse:up', (opt) => {
      this.canvas.setViewportTransform(this.canvas.viewportTransform);
      this.isDragging = false;
      this.canvas.selection = true;
    });

    this.canvas.on('drop', (opt) => {
      const rect = new fromFabric.fabric.Rect({
        top: opt.e.clientY,
        name: 'sensor',
        left: opt.e.clientX,
        width: 50,
        height: 50,
        fill: 'red',
        originX: 'left',
        originY: 'top',
        lockRotation: true,
        hasRotatingPoint: true,
        // minScaleLimit: 1,
        cornerSize: 6,
        cornerColor: '#000',
        cornerStyle: 'circle',
        // transparentCorners: false
      });

      this.canvas.add(rect);
      this.canvas.setActiveObject(rect);
      this.canvas.renderAll();
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.canvas.on('touch:gesture', e => {
      console.log(e);
      if (e.e.touches && e.e.touches.length == 2) {
        this.pausePanning = true;
        var point = new fromFabric.fabric.Point(e.self.x, e.self.y);
        if (e.self.state == "start") {
          this.zoomStartScale = this.canvas.getZoom();
        }
        var delta = this.zoomStartScale * e.self.scale;
        this.canvas.zoomToPoint(point, delta);
        this.pausePanning = false;
      }
    });

    this.canvas.on('object:selected', () => {
      this.pausePanning = true;
    });

    this.canvas.on('selection:cleared', () => {
      this.pausePanning = false;
    });

    this.canvas.on('touch:drag', e => {
      if (this.pausePanning == false && undefined != e.e.layerX && undefined != e.e.layerY) {
        let currentX = e.e.layerX;
        let currentY = e.e.layerY;
        let xChange = currentX - this.lastX;
        let yChange = currentY - this.lastY;

        if ((Math.abs(currentX - this.lastX) <= 50) && (Math.abs(currentY - this.lastY) <= 50)) {
          var delta = new fromFabric.fabric.Point(xChange, yChange);
          this.canvas.relativePan(delta);
        }

        this.lastX = e.e.layerX;
        this.lastY = e.e.layerY;
      }
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  addRect(): void {
    const rect = new fromFabric.fabric.Rect({
      top: 0,
      name: 'rectangle',
      left: 0,
      width: 100,
      height: 100,
      fill: 'lightblue',
      originX: 'left',
      originY: 'top',
      lockRotation: true,
      hasRotatingPoint: true,
      // minScaleLimit: 1,
      cornerSize: 6,
      cornerColor: '#000',
      cornerStyle: 'circle',
      // transparentCorners: false
    });
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
  }

  addSensor(sensor): void {
    var circle = new fromFabric.fabric.Circle({
      radius: 25,
      fill: '#eef',
      originX: 'center',
      originY: 'center',
    });

    var text = new fromFabric.fabric.Text(sensor.id, {
      fontSize: 16,
      originX: 'center',
      originY: 'center',
    });

    var group = new fromFabric.fabric.Group([circle, text], {
      name: `${sensor.id}-group`,
      left: 150,
      top: 100,
    });

    this.canvas.add(group);
  }*/
}
