import Keys from '../util/keyCodes';

export enum MouseButton {
  left,
  right,
}

const interruptKeyCodes = new Set([
  Keys.leftArrow,
  Keys.rightArrow,
  Keys.upArrow,
  Keys.downArrow,
  Keys.space,
]);

export default class ButtonListener {
  _keyDownState: Map<number, boolean> = new Map();
  _keyPressedState: Map<number, boolean> = new Map();
  _mouseDownState: Map<MouseButton, boolean> = new Map();
  _mousePressedState: Map<MouseButton, boolean> = new Map();

  bind(canvas: HTMLCanvasElement) {
    // allows canvas to receive keyboard events & get focus
    canvas.contentEditable = 'true';

    canvas.addEventListener(
      'keydown',
      (e) => {
        this._keyDown(e.keyCode);

        if (interruptKeyCodes.has(e.keyCode)) {
          e.preventDefault();
          return false;
        }
      },
      false
    );

    canvas.addEventListener(
      'keyup',
      (e) => {
        this._keyUp(e.keyCode);
      },
      false
    );

    canvas.addEventListener(
      'mousedown',
      (e) => {
        this._mouseDown(this._getMouseButton(e));
      },
      false
    );

    canvas.addEventListener(
      'mouseup',
      (e) => {
        this._mouseUp(this._getMouseButton(e));
      },
      false
    );
  }

  clearPressed() {
    this._keyPressedState.forEach((val, key) => {
      this._keyPressedState.set(key, false);
    });

    this._mousePressedState.forEach((val, key) => {
      this._mousePressedState.set(key, false);
    });
  }

  isKeyDown(keyCode: number): boolean {
    return this._keyDownState.get(keyCode) === true;
  }

  isKeyPressed(keyCode: number): boolean {
    return this._keyPressedState.get(keyCode) === true;
  }

  isMouseDown(mouseButton: MouseButton): boolean {
    return this._mouseDownState.get(mouseButton) === true;
  }

  isMousePressed(mouseButton: MouseButton): boolean {
    return this._mousePressedState.get(mouseButton) === true;
  }

  private _keyDown(keyCode: number) {
    if (!this._keyPressedState.has(keyCode)) {
      this._keyPressedState.set(keyCode, true);
    }

    this._keyDownState.set(keyCode, true);
  }

  private _keyUp(keyCode: number) {
    this._keyPressedState.delete(keyCode);
    this._keyDownState.delete(keyCode);
  }

  private _mouseDown(mouseButton: MouseButton) {
    if (!this._mousePressedState.has(mouseButton)) {
      this._mousePressedState.set(mouseButton, true);
    }

    this._mouseDownState.set(mouseButton, true);
  }

  private _mouseUp(mouseButton: MouseButton) {
    this._mousePressedState.delete(mouseButton);
    this._mouseDownState.delete(mouseButton);
  }

  private _getMouseButton(e: MouseEvent) {
    if (e.which !== undefined || e.button !== undefined) {
      if (e.which === 3 || e.button === 2) {
        return MouseButton.right;
      } else if (e.which === 1 || e.button === 0 || e.button === 1) {
        return MouseButton.left;
      }
    }

    throw new Error('Cannot judge button pressed on passed mouse button event');
  }
}
