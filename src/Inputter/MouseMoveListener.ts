import { Coordinates } from '../types';

export type MouseListenerFn = (mousePos: Coordinates) => void;

// TODO: what should document actually be here?
function getWindow(document: any): Window {
  return document.parentWindow || document.defaultView;
}

function getElementPosition(element: HTMLElement): Coordinates {
  const rect = element.getBoundingClientRect();
  const document = element.ownerDocument;
  const body = document.body;
  const window = getWindow(document);
  return {
    x:
      rect.left +
      (window.pageXOffset || body.scrollLeft) -
      (body.clientLeft || 0),
    y:
      rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0),
  };
}

export default class MouseMoveListener {
  private _bindings: Set<MouseListenerFn> = new Set();
  private _mousePosition: Coordinates = { x: 0, y: 0 };

  bind(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', (e) => {
      const absoluteMousePosition = this._getAbsoluteMousePosition(e);
      const elementPosition = getElementPosition(canvas);

      this._mousePosition = {
        x: absoluteMousePosition.x - elementPosition.x,
        y: absoluteMousePosition.y - elementPosition.y,
      };

      for (let bindingFn of this._bindings) {
        bindingFn(this.getMousePosition());
      }
    });
  }

  getMousePosition(): Coordinates {
    return this._mousePosition;
  }

  addListener(fn: MouseListenerFn) {
    this._bindings.add(fn);
  }

  removeListener(fn: MouseListenerFn) {
    this._bindings.delete(fn);
  }

  private _getAbsoluteMousePosition(e: MouseEvent): Coordinates {
    if (e.pageX) {
      return { x: e.pageX, y: e.pageY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  }
}
