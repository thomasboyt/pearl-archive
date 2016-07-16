import Game from './Game';
import {Coordinates} from './types';
import {rectanglesIntersecting, RADIANS_TO_DEGREES} from './util/maths';
import Entity from './Entity';

interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
  center?: Coordinates;
  angle?: number;
}

function viewOffset(viewCenter: Coordinates, viewSize: Coordinates): Coordinates {
  return {
    x: -(viewCenter.x - viewSize.x / 2),
    y: -(viewCenter.y - viewSize.y / 2)
  }
}

// sorts passed array by zindex
// elements with a higher zindex are drawn on top of those with a lower zindex
function zIndexSort(a: Entity<any>, b: Entity<any>): number {
  return (a.zIndex || 0) < (b.zIndex || 0) ? -1 : 1;
}

export interface RendererOpts {
  canvas: HTMLCanvasElement,
  width: number;
  height: number;
  backgroundColor?: string;
}

export default class Renderer {
  private _game: Game;
  private _ctx: CanvasRenderingContext2D;
  private _backgroundColor?: string;

  private _viewSize: Coordinates;
  private _viewCenter: Coordinates;

  constructor(game: Game) {
    this._game = game;
  }

  run(opts: RendererOpts) {
    const canvas = opts.canvas;

    canvas.style.outline = 'none';   // stop browser outlining canvas when it has focus
    canvas.style.cursor = 'default'; // keep pointer normal when hovering over canvas

    this._ctx = canvas.getContext('2d')!;
    this._backgroundColor = opts.backgroundColor;

    // TODO: account for retina scaling here!
    canvas.width = opts.width;
    canvas.height = opts.height;

    this._viewSize = { x: opts.width, y: opts.height };
    this._viewCenter = { x: this._viewSize.x / 2, y: this._viewSize.y / 2 };
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

  setViewCenter(pos: Coordinates) {
    this._viewCenter = {
      x: pos.x,
      y: pos.y,
    };
  }

  setBackground(color: string) {
    this._backgroundColor = color;
  }

  // TODO: (a) this needs a null-check on obj.center, (b) why does this only support rectangles??
  // onScreen(obj: Entity): boolean {
  //   return rectanglesIntersecting(obj, {
  //     size: this._viewSize,
  //     center: this._viewCenter,
  //   });
  // }

  update() {
    const ctx = this.getCtx();
    const viewTranslate = viewOffset(this._viewCenter, this._viewSize);

    ctx.translate(viewTranslate.x, viewTranslate.y);
    // draw background
    const viewArgs = [
      this._viewCenter.x - this._viewSize.x / 2,
      this._viewCenter.y - this._viewSize.y / 2,
      this._viewSize.x,
      this._viewSize.y
    ];

    if (this._backgroundColor !== undefined) {
      ctx.fillStyle = this._backgroundColor;
      ctx.fillRect(viewArgs[0], viewArgs[1], viewArgs[2], viewArgs[3]);
    } else {
      ctx.clearRect(viewArgs[0], viewArgs[1], viewArgs[2], viewArgs[3]);
    }

    const drawables = ([this._game] as Drawable[])
      .concat([...this._game.entities.all()].sort(zIndexSort));

    for (let drawable of drawables) {
      ctx.save();

      if (drawable.center !== undefined && drawable.angle !== undefined) {
        ctx.translate(drawable.center.x, drawable.center.y);
        ctx.rotate(drawable.angle * RADIANS_TO_DEGREES);
        ctx.translate(-drawable.center.x, -drawable.center.y);
      }

      drawable.draw(ctx);

      ctx.restore();
    }
  }
}
