export default class Sprite {
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(img: HTMLImageElement, x: number, y: number, width: number, height: number) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D, destX: number, destY: number) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
                  destX, destY, this.width, this.height);
  }
}
