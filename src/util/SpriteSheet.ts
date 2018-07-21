import Sprite from './Sprite';

/**
 * Interface representing a SpriteSheet. It only has to implement one method,
 * `createSprite(name: any)`, that returns a Sprite.
 */
export interface ISpriteSheet {
  createSprite(name: any): Sprite;
}

/**
 * Creates `Sprite` objects from a sprite sheet.
 *
 * This class is very naive, and makes the following big assumptions:
 *
 * - Every sprite is the same size (as defined by spriteWidth and spriteHeight)
 * - All sprites are aligned in rows and columns with no padding.
 *
 * `createSprite(n)` then returns the sprite at that index. So, if you had a 4x4
 * sprite sheet, `createSprite(0)` would get you the first sprite in the first
 * row, `createSprite(4)` would get you the first sprite in the _second_ row,
 * etc.
 *
 * If you need a more advanced SpriteSheet, such as one that can handle a sprite
 * atlas, simply implement the ISpriteSheet interface that this class
 * implements.
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
