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

  create(settings: Settings) {
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

  get masked() {
    return this._masked;
  }

  private _maskFrom: [number, number, number];
  private _maskTo: [number, number, number];

  mask(from: RGB, to: RGB) {
    this._masked = true;
    this._maskFrom = from;
    this._maskTo = to;
  }

  unmask() {
    this._masked = false;
    delete this._maskFrom;
    delete this._maskTo;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.sprite) {
      return;
    }

    const phys = this.getComponent(Physical);

    ctx.translate(phys.center.x, phys.center.y);
    ctx.rotate(phys.angle);

    const sprite = this.sprite;

    const destX = -sprite.width / 2;
    const destY = -sprite.height / 2;

    ctx.scale(this.scaleX, this.scaleY);

    sprite.draw(ctx, destX, destY);

    if (this.masked) {
      sprite.drawMasked(ctx, destX, destY, this._maskFrom, this._maskTo);
    } else {
      sprite.draw(ctx, destX, destY);
    }
  }
}
