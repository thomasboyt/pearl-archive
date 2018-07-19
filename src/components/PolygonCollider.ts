import * as SAT from 'sat';

import Physical from './Physical';
import Collider, {
  ICollider,
  CollisionResponse,
  ColliderType,
} from './Collider';
import CircleCollider from './CircleCollider';

import { rotatePoint } from '../util/maths';

export type Point = [number, number];
export type Segment = [Point, Point];

export interface BoxOptions {
  width: number;
  height: number;
  angle?: number;
}

export interface Options {
  points?: [number, number][];
  angle?: number;
}

export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

function getBoundsFromPolygon(polygon: SAT.Polygon): Bounds {
  const points = polygon.calcPoints;
  let xMin = points[0].x;
  let yMin = points[0].y;
  let xMax = points[0].x;
  let yMax = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point.x < xMin) {
      xMin = point.x;
    } else if (point.x > xMax) {
      xMax = point.x;
    }
    if (point.y < yMin) {
      yMin = point.y;
    } else if (point.y > yMax) {
      yMax = point.y;
    }
  }

  return { xMin, yMin, xMax, yMax };
}

export default class PolygonCollider extends Collider<Options>
  implements ICollider {
  /**
   * Convenience method to create a rectangular polygon.
   */
  static createBox(opts: BoxOptions): PolygonCollider {
    const poly = new PolygonCollider();

    poly.setBoxSize({
      width: opts.width,
      height: opts.height,
      angle: opts.angle,
    });

    return poly;
  }

  type: ColliderType = ColliderType.Polygon;

  points: [number, number][] = [];
  angle: number = 0;

  // These properties only exist on Boxes, and maybe should be moved to an actual BoxCollider
  // subclass of this. Hm.
  // https://docs.unity3d.com/ScriptReference/Renderer-bounds.html might be worth looking into
  width?: number;
  height?: number;

  isVisible = false;

  create(options: Options = {}) {
    if (options.points) {
      this.points = options.points;
    }
    if (options.angle) {
      this.angle = options.angle;
    }
    this.gameObject.registerCollider(this);
  }

  /**
   * Replace the points in this collider with a box.
   */
  setBoxSize(opts: BoxOptions) {
    const points: Point[] = [
      [-opts.width / 2, -opts.height / 2],
      [opts.width / 2, -opts.height / 2],
      [opts.width / 2, opts.height / 2],
      [-opts.width / 2, opts.height / 2],
    ];

    this.points = points;
    this.angle = opts.angle || 0;

    this.width = opts.width;
    this.height = opts.height;
  }

  /**
   * Returns the AABB bounding box for this polygon as rendered on screen.
   */
  getBounds(): Bounds {
    const polygon = this.getSATPolygon();
    return getBoundsFromPolygon(polygon);
  }

  getLocalBounds(): Bounds {
    const bounds = this.getBounds();
    const phys = this.getComponent(Physical);

    const min = phys.worldToLocal({ x: bounds.xMin, y: bounds.yMin });
    const max = phys.worldToLocal({ x: bounds.xMax, y: bounds.yMax });

    return {
      xMin: min.x,
      xMax: max.x,
      yMin: min.y,
      yMax: max.y,
    };
  }

  getSATPolygon(): SAT.Polygon {
    // TODO: This part can be cached...
    const vectors = this.points.map(([x, y]) => new SAT.Vector(x, y));
    const polygon = new SAT.Polygon(new SAT.Vector(0, 0), vectors);

    // ...but this part can't!
    const { x, y } = this.getComponent(Physical).center;
    polygon.rotate(this.angle);
    polygon.translate(x, y);

    return polygon;
  }

  protected testPolygon(other: PolygonCollider): CollisionResponse | null {
    const selfPoly = this.getSATPolygon();
    const otherPoly = other.getSATPolygon();

    const resp = new SAT.Response();
    const collided = SAT.testPolygonPolygon(selfPoly, otherPoly, resp);

    if (collided) {
      return this.responseFromSAT(resp);
    } else {
      return null;
    }
  }

  protected testCircle(other: CircleCollider): CollisionResponse | null {
    const selfPoly = this.getSATPolygon();
    const otherCircle = other.getSATCircle();

    const resp = new SAT.Response();
    const collided = SAT.testPolygonCircle(selfPoly, otherCircle, resp);

    if (collided) {
      return this.responseFromSAT(resp);
    } else {
      return null;
    }
  }

  // Debug rendering, defaults to off
  render(ctx: CanvasRenderingContext2D) {
    const poly = this.getSATPolygon();
    const points = poly.points;
    const pos = poly.pos;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(pos.x + points[0].x, pos.y + points[0].y);
    for (let point of points.slice(1)) {
      ctx.lineTo(pos.x + point.x, pos.y + point.y);
    }

    ctx.closePath();
    ctx.fill();
  }
}
