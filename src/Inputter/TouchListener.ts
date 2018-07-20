import { Vector2 } from '../types';

export default class TouchListener {
  private _touchPositions = new Map<number, Vector2>();

  bind(canvas: HTMLCanvasElement) {
    // TODO: Make this relative to canvas, and not viewport
    // See MouseMoveListener

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();

      for (let touch of Array.from(e.changedTouches)) {
        const position = {
          x: touch.clientX,
          y: touch.clientY,
        };

        this._touchPositions.set(touch.identifier, position);
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let touch of Array.from(e.changedTouches)) {
        const position = {
          x: touch.clientX,
          y: touch.clientY,
        };
        this._touchPositions.set(touch.identifier, position);
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
