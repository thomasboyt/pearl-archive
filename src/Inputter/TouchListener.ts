import { Vector2 } from '../types';
import getPositionRelativeToElement from './getPositionRelativeToElement';

export default class TouchListener {
  private _touchPositions = new Map<number, Vector2>();

  bind(canvas: HTMLCanvasElement) {
    const getPositionFromTouch = (touch: Touch): Vector2 => {
      return getPositionRelativeToElement(
        {
          x: touch.clientX,
          y: touch.clientY,
        },
        canvas
      );
    };

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();

      for (let touch of Array.from(e.changedTouches)) {
        this._touchPositions.set(touch.identifier, getPositionFromTouch(touch));
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let touch of Array.from(e.changedTouches)) {
        this._touchPositions.set(touch.identifier, getPositionFromTouch(touch));
      }
    });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      for (let touch of Array.from(e.changedTouches)) {
        this._touchPositions.delete(touch.identifier);
      }
    });

    canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      for (let touch of Array.from(e.changedTouches)) {
        this._touchPositions.delete(touch.identifier);
      }
    });
  }

  getTouchPositions() {
    return this._touchPositions;
  }
}
