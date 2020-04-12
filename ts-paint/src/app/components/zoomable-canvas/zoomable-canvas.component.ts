import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'tsp-zoomable-canvas',
  templateUrl: './zoomable-canvas.component.html',
  styleUrls: ['./zoomable-canvas.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoomableCanvasComponent implements OnChanges {
  @Input()
  zoom: number = 1;
  @Input()
  image: ImageData;
  @ViewChild('imageCanvas', { static: true })
  imageCanvas: ElementRef;

  zoomedWidth: number = 0;
  zoomedHeight: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.zoomedWidth = (this.image?.width ?? 0) * this.zoom;
    this.zoomedHeight = (this.image?.height ?? 0) * this.zoom;

    if (changes.image && this.imageCanvas) {
      this.drawImage(this.image, this.imageCanvas.nativeElement);
    }
  }

  private drawImage(image: ImageData, canvas: HTMLCanvasElement) {
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    const context = canvas.getContext('2d');
    context.putImageData(this.image, 0, 0);
  }
}