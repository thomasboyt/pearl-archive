import Sprite, { RGB } from './Sprite';
import { ISpriteSheet } from './SpriteSheet';

export interface AnimationConfig {
  frames: any[];
  frameLengthMs: number | null;
}

export default class Animation {
  private _sheet: ISpriteSheet;
  private _frameLengthMs: number | null;

  private _frames: any[];
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
