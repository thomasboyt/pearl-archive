import Sprite from './Sprite';

export interface ISpriteSheet {
  createSprite(name: any): Sprite;
}

/**
 * Creates `Sprite` objects from a sprite sheet.
 */
export default class SpriteSheet implements ISpriteSheet {
  img: HTMLImageElement;
  spriteWidth: number;
  spriteHeight: number;
  sprites: Sprite[];

  constructor(
    img: HTMLImageElement,
    spriteWidth: number,
    spriteHeight: number
  ) {
    if (!img) {
      throw new Error('nonexistent image');
    }

    this.img = img;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
  }

  /**
   * Return a new `Sprite` object for a sprite at a given index
   */
  createSprite(num: number): Sprite {
    let x = num * this.spriteWidth;

    let row = 0;
    while (x > this.img.width - this.spriteWidth) {
      row++;
      x -= this.img.width;
    }

    return new Sprite(
      this.img,
      x,
      row * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight
    );
  }
}
