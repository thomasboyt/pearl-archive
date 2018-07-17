import Component from '../Component';
import Physical from './Physical';

import Sprite, { RGB } from '../util/Sprite';
import { ISpriteSheet } from '../util/SpriteSheet';
import SpriteRenderer from './SpriteRenderer';

export interface AnimationConfig {
  frames: any[];
  frameLengthMs: number | null;
}

class Animation {
  private _sheet: ISpriteSheet;
  private _frameLengthMs: number | null;

  private _frames: number[];
  private _sprites: Sprite[] = [];
  private _currentFrameIdx: number;

  private _elapsed: number;

  constructor(sheet: ISpriteSheet, cfg: AnimationConfig) {
    this._sheet = sheet;

    this._frames = cfg.frames;
    this._frameLengthMs = cfg.frameLengthMs;

    for (let frame of this._frames) {
      this._sprites.push(this._sheet.createSprite(frame));
    }

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
    return this._sprites[this._currentFrameIdx];
  }
}

export interface AnimationConfigMap {
  [key: string]: AnimationConfig;
}

export interface Options {
  sheet: ISpriteSheet;
  initialState: string;
  animations: AnimationConfigMap;
}

export default class AnimationManager extends Component<Options> {
  private _sheet: ISpriteSheet;
  private _animationConfig: AnimationConfigMap;
  private _currentState: string;
  private _current: Animation;

  // TODO: what was this for
  get current() {
    return this._currentState;
  }

  create(opts: Options) {
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
    this.setSpriteFromAnimation();
  }

  private setSpriteFromAnimation() {
    const sprite = this._current.getSprite();
    this.getComponent(SpriteRenderer).sprite = sprite;
  }

  update(dt: number) {
    this._current.update(dt);
    this.setSpriteFromAnimation();
  }
}
