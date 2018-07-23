import Sprite, { RGB } from '../util/Sprite';
import Physical from './Physical';
import Component from '../Component';

interface Settings {
  sprite?: Sprite;
  scaleX?: number;
  scaleY?: number;
}

export default class SpriteRenderer extends Component<Settings> {
  sprite?: Sprite;

  scaleX: number = 1;
  scaleY: number = 1;

  create(settings: Settings = {}) {
    if (settings.sprite) {
      this.sprite = settings.sprite;
    }
    if (settings.scaleX) {
      this.scaleX = settings.scaleX;
    }
    if (settings.scaleY) {
      this.scaleY = settings.scaleY;
    }
  }

  private _masked = false;
  private _maskFrom: [number, number, number];
  private _maskTo: [number, number, number];

  /**
   * Set a "mask" on the sprite, which simply replaces one color with another.
   * Useful for, e.g. rendering the same player sprite in different colors.
   *
   * A sprite can currently only have one mask at a time, meaning only one color
   * can be changed to one other color.
   */
  mask(from: RGB, to: RGB) {
    this._masked = true;
    this._maskFrom = from;
    this._maskTo = to;
  }

  /**
   * Remove a mask from the sprite, if set.
   */
  unmask() {
    this._masked = false;
    delete this._maskFrom;
    delete this._maskTo;
  }

  /**
   * Returns the current sprite rendered to a canvas, with its top left corner
   * at [0, 0], without any scaling or totation applied.
   */
  getCanvas(): HTMLCanvasElement {
    const sprite = this.sprite!;
    const canvas = document.createElement('canvas');
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    const ctx = canvas.getContext('2d')!;
    this.draw(ctx, 0, 0);
    return canvas;
  }

  /**
   * Draw the sprite, without scale or rotation, to a passed canvas context
   */
  private draw(ctx: CanvasRenderingContext2D, destX: number, destY: number) {
    const sprite = this.sprite!;

    if (this._masked) {
      sprite.drawMasked(ctx, destX, destY, this._maskFrom, this._maskTo);
    } else {
      sprite.draw(ctx, destX, destY);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.sprite) {
      return;
    }

    const phys = this.getComponent(Physical);
    ctx.translate(phys.center.x, phys.center.y);

    ctx.scale(this.scaleX, this.scaleY);
    ctx.rotate(this.getComponent(Physical).angle);

    const destX = -this.sprite.width / 2;
    const destY = -this.sprite.height / 2;
    this.draw(ctx, destX, destY);
  }
}
