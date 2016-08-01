import Sprite from './Sprite';

/**
 * Creates `Sprite` objects from a sprite sheet.
 */
export default class SpriteSheet {
  img: HTMLImageElement;
  spriteWidth: number;
  spriteHeight: number;

  constructor(img: HTMLImageElement, spriteWidth: number, spriteHeight: number) {
    if (!img) {
      throw new Error('nonexistent image')
    }

    this.img = img;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
  }

  /**
   * Return a new `Sprite` object for a sprite at a given index
   */
  get(num: number): Sprite {
    var x = num * this.spriteWidth;

    var row = 0;
    while (x > (this.img.width - this.spriteWidth)) {
      row++;
      x -= this.img.width;
    }

    return new Sprite(this.img, x, row * this.spriteHeight, this.spriteWidth, this.spriteHeight);
  }
}
