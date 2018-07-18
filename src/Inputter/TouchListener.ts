import { Coordinates } from '../types';

export default class TouchListener {
  private _touchPositions = new Map<number, Coordinates>();

  bind(canvas: HTMLCanvasElement) {
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();

      for (let touch of Array.from(e.changedTouches)) {
        // TODO: what is clientX/clientY relative to? log this
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

  // getMousePosition(): Coordinates {
  //   return this._mousePosition;
  // }
}
