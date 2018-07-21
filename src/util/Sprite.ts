import memoize from 'micro-memoize';
import { deepEqual } from 'fast-equals';

export type RGB = [number, number, number];

/**
 * The Sprite class simply wraps an <img> element (HTMLImageElement), which can
 * be rendered into a <canvas> using draw(ctx). It also supports drawing a
 * _masked_ Sprite - that is, one with one color replaced with another - using
 * drawMasked().
 *
 * Sprites support an offset X and Y value when created, so that the underlying
 * image can be an unmodified sprite sheet.
 */
export default class Sprite {
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;

  canvas: HTMLCanvasElement;

  constructor(
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );

    this.canvas = canvas;
  }

  private _getMasked(from: RGB, to: RGB): HTMLCanvasElement {
    const maskedCanvas = document.createElement('canvas');
    maskedCanvas.width = this.width;
    maskedCanvas.height = this.height;

    const ctx = this.canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, this.width, this.height);

    for (var i = 0; i < imageData.data.length; i += 4) {
      // is this pixel the old rgb?
      if (
        imageData.data[i] == from[0] &&
        imageData.data[i + 1] == from[1] &&
        imageData.data[i + 2] == from[2]
      ) {
        // change to your new rgb
        imageData.data[i] = to[0];
        imageData.data[i + 1] = to[1];
        imageData.data[i + 2] = to[2];
      }
    }

    maskedCanvas.getContext('2d')!.putImageData(imageData, 0, 0);

    return maskedCanvas;
  }

  getMasked = memoize(this._getMasked, { isEqual: deepEqual });

  draw(ctx: CanvasRenderingContext2D, destX: number, destY: number) {
    ctx.drawImage(this.canvas, destX, destY, this.width, this.height);
  }

  drawMasked(
    ctx: CanvasRenderingContext2D,
    destX: number,
    destY: number,
    from: RGB,
    to: RGB
  ) {
    ctx.drawImage(
      this.getMasked(from, to),
      destX,
      destY,
      this.width,
      this.height
    );
  }
}
