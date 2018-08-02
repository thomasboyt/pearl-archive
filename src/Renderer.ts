import PearlInstance from './PearlInstance';
import { Vector2 } from './types';
import Entity from './Entity';

function viewOffset(viewCenter: Vector2, viewSize: Vector2): Vector2 {
  return {
    x: -(viewCenter.x - viewSize.x / 2),
    y: -(viewCenter.y - viewSize.y / 2),
  };
}

// sorts passed array by zindex
//
// elements with a higher zindex are drawn on top of those with a lower zindex
function zIndexSort(a: Entity, b: Entity): number {
  return (a.zIndex || 0) < (b.zIndex || 0) ? -1 : 1;
}

export interface RendererOpts {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  backgroundColor?: string;
}

export default class Renderer {
  private _pearl: PearlInstance;
  private _ctx: CanvasRenderingContext2D;
  private _backgroundColor?: string;

  private _viewSize: Vector2;
  private _viewCenter: Vector2;
  private _scaleFactor: number = 1;
  private _pixelRatio: number = 1;

  /**
   * Return the _logical_ scale factor of the canvas. Multiplying this by
   * `this.getViewSize()` would return the logical number of pixels wide and
   * tall the canvas is.
   *
   * "Logical" means, unlike `this.totalScaleFactor`, the pixel ratio of high
   * DPI screens isn't taken into account, similar to how CSS pixels and DOM
   * positions are handled.
   */
  get logicalScaleFactor() {
    return this._scaleFactor / this._pixelRatio;
  }

  /**
   * Return the _physical_ scale factor of the canvas. Multiplying this by
   * `this.getViewSize()` would return the physical number of pixels wide and
   * tall the canvas is.
   */
  get totalScaleFactor() {
    return this._scaleFactor;
  }

  constructor(game: PearlInstance) {
    this._pearl = game;
  }

  run(opts: RendererOpts) {
    const canvas = opts.canvas;

    // stop browser outlining canvas when it has focus
    canvas.style.outline = 'none';

    // keep pointer normal when hovering over canvas
    canvas.style.cursor = 'default';

    this._ctx = canvas.getContext('2d')!;
    this._backgroundColor = opts.backgroundColor;

    this._viewSize = { x: opts.width, y: opts.height };
    this._viewCenter = { x: this._viewSize.x / 2, y: this._viewSize.y / 2 };

    this.scale(1);
  }

  /**
   * Scale the canvas by a given factor.
   */
  scale(factor: number) {
    const canvas = this._ctx.canvas;

    if (window.devicePixelRatio !== undefined) {
      this._pixelRatio = window.devicePixelRatio;
    }

    const viewSize = this.getViewSize();
    const width = viewSize.x;
    const height = viewSize.y;

    canvas.width = factor * width * this._pixelRatio;
    canvas.height = factor * height * this._pixelRatio;

    canvas.style.width = `${factor * width}px`;
    canvas.style.height = `${factor * height}px`;

    this._scaleFactor = factor * this._pixelRatio;

    // disable image smoothing
    // XXX: this _has_ to be re-set every time the canvas is resized
    this._ctx.mozImageSmoothingEnabled = false;
    this._ctx.webkitImageSmoothingEnabled = false;
    this._ctx.imageSmoothingEnabled = false;
  }

  // TODO: Evaluate the usefulness of these
  getCtx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  /**
   * Return the view size of the game, usually the same as the width and height
   * set when the Pearl instance is created.
   *
   * To get the actual size of the canvas, you can multiply this by
   * `renderer.logicalScaleFactor` or `renderer.totalScaleFactor`.
   */
  getViewSize(): Vector2 {
    return this._viewSize;
  }

  /**
   * Return the current center of the viewport in the game world.
   */
  getViewCenter(): Vector2 {
    return this._viewCenter;
  }

  /**
   * Set the center point of the viewport.
   *
   * This only translates the view by whole pixels to prevent rendering bugs
   * that appear when translating a scene by a float. This translation takes
   * into account the game's current scale factor.
   */
  setViewCenter(pos: Vector2) {
    const roundedScaledPos = {
      x: Math.round(pos.x * this._scaleFactor),
      y: Math.round(pos.y * this._scaleFactor),
    };

    this._viewCenter = {
      x: roundedScaledPos.x / this._scaleFactor,
      y: roundedScaledPos.y / this._scaleFactor,
    };
  }

  /**
   * Set the background color of the game.
   */
  setBackground(color: string) {
    this._backgroundColor = color;
  }

  update() {
    const ctx = this.getCtx();

    ctx.save();

    this._ctx.scale(this._scaleFactor, this._scaleFactor);

    const viewTranslate = viewOffset(this._viewCenter, this._viewSize);

    ctx.translate(viewTranslate.x, viewTranslate.y);
    // draw background
    const viewArgs = [
      this._viewCenter.x - this._viewSize.x / 2,
      this._viewCenter.y - this._viewSize.y / 2,
      this._viewSize.x,
      this._viewSize.y,
    ];

    if (this._backgroundColor !== undefined) {
      ctx.fillStyle = this._backgroundColor;
      ctx.fillRect(viewArgs[0], viewArgs[1], viewArgs[2], viewArgs[3]);
    } else {
      ctx.clearRect(viewArgs[0], viewArgs[1], viewArgs[2], viewArgs[3]);
    }

    const drawables = [...this._pearl.entities.all()].sort(zIndexSort);

    for (let drawable of drawables) {
      drawable.render(ctx);
    }

    ctx.restore();
  }
}
