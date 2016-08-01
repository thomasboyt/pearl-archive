import Component from '../Component';
import Physical from './Physical';

import Sprite from '../util/Sprite';
import SpriteSheet from '../util/SpriteSheet';

const blankSprite = new Sprite(new Image(), 0, 0, 0, 0);

export interface AnimationConfig {
  frames: number[];
  frameLengthMs: number | null;
}

class Animation {
  private _sheet: SpriteSheet;
  private _frameLengthMs: number | null;

  private _frames: number[];
  private _currentFrameIdx: number;

  private _elapsed: number;

  constructor(sheet: SpriteSheet, cfg: AnimationConfig) {
    this._sheet = sheet;

    this._frames = cfg.frames;
    this._frameLengthMs = cfg.frameLengthMs;

    this._currentFrameIdx = 0;
    this._elapsed = 0;
  }

  update(dt: number) {
    this._elapsed += dt;

    if (this._frameLengthMs === null) {
      return;
    }

    if (this._elapsed > this._frameLengthMs) {
      this._currentFrameIdx += 1;

      if (this._currentFrameIdx >= this._frames.length) {
        this._currentFrameIdx = 0;
      }

      this._elapsed = 0;
    }
  }

  getSprite() {
    const frame = this._frames[this._currentFrameIdx];

    if (frame === null) {
      return blankSprite;
    } else {
      return this._sheet.get(frame);
    }
  }

}

export interface AnimationConfigMap {
  [key: string]: AnimationConfig;
}

export interface Options {
  sheet: SpriteSheet;
  initialState: string;
  animations: AnimationConfigMap;
}

export default class AnimationManager extends Component<Options> {
  private _sheet: SpriteSheet;
  private _animationConfig: AnimationConfigMap;
  private _currentState: string;
  private _current: Animation;

  private scaleX: number = 1;
  private scaleY: number = 1;

  init(opts: Options) {
    this._sheet = opts.sheet;
    this._animationConfig = opts.animations;
    this.set(opts.initialState);
  }

  set(state: string) {
    if (state === this._currentState) {
      return;
    }

    this._currentState = state;
    const cfg = this._animationConfig[state];
    this._current = new Animation(this._sheet, cfg);
  }

  setScale(sx: number, sy: number) {
    this.scaleX = sx;
    this.scaleY = sy;
  }

  update(dt: number) {
    this._current.update(dt);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    const phys = this.getComponent(Physical);

    ctx.translate(phys.center.x, phys.center.y);

    const sprite = this._current.getSprite();

    const destX = -sprite.width / 2;
    const destY = -sprite.height / 2;

    ctx.scale(this.scaleX, this.scaleY);

    sprite.draw(ctx, destX, destY);
    ctx.restore();
  }
}
