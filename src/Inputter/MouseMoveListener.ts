import { Vector2 } from '../types';
import getPositionRelativeToElement from './getPositionRelativeToElement';

export type MouseListenerFn = (mousePos: Vector2) => void;

export default class MouseMoveListener {
  private _bindings: Set<MouseListenerFn> = new Set();
  private _mousePosition: Vector2 = { x: 0, y: 0 };

  bind(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', (e) => {
      this._mousePosition = getPositionRelativeToElement(
        this._getAbsoluteMousePosition(e),
        canvas
      );

      for (let bindingFn of this._bindings) {
        bindingFn(this.getMousePosition());
      }
    });
  }

  getMousePosition(): Vector2 {
    return this._mousePosition;
  }

  addListener(fn: MouseListenerFn) {
    this._bindings.add(fn);
  }

  removeListener(fn: MouseListenerFn) {
    this._bindings.delete(fn);
  }

  private _getAbsoluteMousePosition(e: MouseEvent): Vector2 {
    if (e.pageX) {
      return { x: e.pageX, y: e.pageY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  }
}
