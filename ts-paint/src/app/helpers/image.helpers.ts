import { Color } from '../types/base/color';
import { Point } from '../types/base/point';
import { RectangleArea } from '../types/base/rectangle-area';

export function createImage(width: number, height: number, color: Color = { r: 255, g: 255, b: 255 }): ImageData {
  const image: ImageData = new ImageData(width, height);
  return fillImage(image, color);
}

export function cloneImage(original: ImageData): ImageData {
  const clone: ImageData = new ImageData(original.width, original.height);

  original.data.forEach((x, i) => {
    clone.data[i] = x;
  });

  return clone;
}

export function fillImage(image: ImageData, color: Color): ImageData {
  return fillArea(image, color, { start: { w: 0, h: 0 }, end: { w: image.width - 1, h: image.height - 1 } });
}

export function fillArea(image: ImageData, color: Color, area: RectangleArea): ImageData {
  const newImage: ImageData = new ImageData(image.width, image.height);
  const newImageData: Uint8ClampedArray = newImage.data;

  for (var i = 0; i < newImageData.length; i += 4) {
    if (isSubpixelInRectangle(i, area, image)) {
      [newImageData[i], newImageData[i + 1], newImageData[i + 2], newImageData[i + 3]] = [color.r, color.g, color.b, color.a ?? 255];
    }
  }

  return newImage;
}

export function isSubpixelInRectangle(subpixelOffset: number, rectangle: RectangleArea, image: ImageData): boolean {
  const location: Point = calculateLocation(subpixelOffset, image);

  return isPointInRectangle(location, rectangle);
}

export function isPointInRectangle(point: Point, rectangle: RectangleArea): boolean {
  return point.w >= Math.min(rectangle.start.w, rectangle.end.w) &&
    point.w <= Math.max(rectangle.start.w, rectangle.end.w) &&
    point.h >= Math.min(rectangle.start.h, rectangle.end.h) &&
    point.h <= Math.max(rectangle.start.h, rectangle.end.h);
}

export function calculateLocation(subpixelOffset: number, image: ImageData): Point {
  const pixelIndex: number = Math.floor(subpixelOffset / 4);
  const h: number = Math.floor(pixelIndex / image.width);
  const w: number = pixelIndex - image.width * h;

  return { w, h };
}

export function getPixelOffset(point: Point, image: ImageData): number {
  return 4 * (point.w + image.width * point.h);
}

export function getImagePart(area: RectangleArea, image: ImageData): ImageData {
  const imagePart: ImageData = new ImageData(getAreaWidth(area), getAreaHeight(area));

  const subpixelsPerRow: number = 4 * imagePart.width;

  let hMin: number = Math.min(area.start.h, area.end.h);
  let wMin: number = Math.min(area.start.w, area.end.w);

  let imagePixelOffset: number;
  let partPixelOffset: number = 0;

  for (var h = 0; h < imagePart.height; h++) {
    imagePixelOffset = getPixelOffset({ w: wMin, h: hMin + h }, image);
    for (var spw = 0; spw < subpixelsPerRow; spw++) {
      imagePart.data[partPixelOffset] = image.data[imagePixelOffset + spw];
      partPixelOffset++;
    }
  }

  return imagePart;
}

export function getAreaWidth(area: RectangleArea): number {
  return 1 + Math.abs(area.end.w - area.start.w);
}

export function getAreaHeight(area: RectangleArea): number {
  return 1 + Math.abs(area.end.h - area.start.h);
}

export function pasteImagePart(location: Point, imagePart: ImageData, image: ImageData) {
  const subpixelsPerRow: number = 4 * imagePart.width;

  let hMin: number = location.h;
  let wMin: number = location.w;

  let partPixelOffset: number = 0;
  let imagePixelOffset: number;

  for (var h = 0; h < imagePart.height; h++) {
    imagePixelOffset = getPixelOffset({ w: wMin, h: hMin + h }, image);
    for (var spw = 0; spw < subpixelsPerRow; spw++) {
      image.data[imagePixelOffset + spw] = imagePart.data[partPixelOffset];
      partPixelOffset++;
    }
  }

  return imagePart;
}