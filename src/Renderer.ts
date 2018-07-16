import PearlInstance from './PearlInstance';
import { Coordinates } from './types';
import GameObject from './GameObject';

function viewOffset(
  viewCenter: Coordinates,
  viewSize: Coordinates
): Coordinates {
  return {
    x: -(viewCenter.x - viewSize.x / 2),
    y: -(viewCenter.y - viewSize.y / 2),
  };
}

// sorts passed array by zindex
// elements with a higher zindex are drawn on top of those with a lower zindex
function zIndexSort(a: GameObject, b: GameObject): number {
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

  private _viewSize: Coordinates;
  private _viewCenter: Coordinates;
  private _scaleFactor: number = 1;

  constructor(game: PearlInstance) {
    this._pearl = game;
  }

  run(opts: RendererOpts) {
    const canvas = opts.canvas;

    canvas.style.outline = 'none'; // stop browser outlining canvas when it has focus
    canvas.style.cursor = 'default'; // keep pointer normal when hovering over canvas

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
    // Scale for retina displays
    let pixelRatio = 1;

    if (window.devicePixelRatio !== undefined) {
      pixelRatio = window.devicePixelRatio;
    }

    const viewSize = this.getViewSize();
    const width = viewSize.x;
    const height = viewSize.y;

    canvas.width = factor * width * pixelRatio;
    canvas.height = factor * height * pixelRatio;

    canvas.style.width = `${factor * width}px`;
    canvas.style.height = `${factor * height}px`;

    this._scaleFactor = factor * pixelRatio;

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

  getViewSize(): Coordinates {
    return this._viewSize;
  }

  getViewCenter(): Coordinates {
    return this._viewCenter;
  }

  /**
   * Set the center coordinates of the viewport.
   */
  setViewCenter(pos: Coordinates) {
    this._viewCenter = {
      x: pos.x,
      y: pos.y,
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
