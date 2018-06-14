import { Coordinates } from '../types';
import ButtonListener, { MouseButton } from './ButtonListener';
import MouseMoveListener, { MouseListenerFn } from './MouseMoveListener';

export default class Inputter {
  private _buttonListener: ButtonListener = new ButtonListener();
  private _mouseMoveListener: MouseMoveListener = new MouseMoveListener();

  bind(canvas: HTMLCanvasElement) {
    this._buttonListener.bind(canvas);
    this._mouseMoveListener.bind(canvas);
  }

  update() {
    this._buttonListener.clearPressed();
  }

  isKeyDown(keyCode: number): boolean {
    return this._buttonListener.isKeyDown(keyCode);
  }

  isKeyPressed(keyCode: number): boolean {
    return this._buttonListener.isKeyPressed(keyCode);
  }

  isMouseDown(mouseButton: MouseButton): boolean {
    return this._buttonListener.isMouseDown(mouseButton);
  }

  isMousePressed(mouseButton: MouseButton): boolean {
    return this._buttonListener.isMousePressed(mouseButton);
  }

  getMousePosition(): Coordinates {
    return this._mouseMoveListener.getMousePosition();
  }

  bindMouseMove(fn: MouseListenerFn) {
    return this._mouseMoveListener.addListener(fn);
  }

  unbindMouseMove(fn: MouseListenerFn) {
    return this._mouseMoveListener.removeListener(fn);
  }
}
