import Component from '../Component';
import SpriteRenderer from './SpriteRenderer';

import { ISpriteSheet } from '../util/SpriteSheet';
import Animation, { AnimationConfig } from '../util/Animation';

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

  /**
   * Set the animation state. Will throw an error if the animation does not
   * exist.
   */
  set(state: string) {
    if (state === this._currentState) {
      return;
    }

    this._currentState = state;
    const cfg = this._animationConfig[state];

    if (!cfg) {
      throw new Error(
        `Animation state ${state} does not exist for entity ${
          this.gameObject.name
        }`
      );
    }

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
