import * as SAT from 'sat';
import crosses from 'robust-segment-intersect';

import Physical from './Physical';
import Collider, {CollisionResponse, ColliderType} from './Collider';
import CircleCollider from './CircleCollider';

import {rotatePoint} from '../util/maths';

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

export default class PolygonCollider extends Collider<Options> {
  /**
   * Convenience method to create a rectangular polygon.
   */
  static createBox(opts: BoxOptions): PolygonCollider {
    const points: Point[] = [
      [-opts.width / 2, -opts.height / 2],
      [opts.width / 2, -opts.height / 2],
      [opts.width / 2, opts.height / 2],
      [-opts.width / 2, opts.height / 2],
    ];

    const angle = opts.angle || 0;

    const poly = new PolygonCollider({
      points,
      angle,
    });

    poly.width = opts.width;
    poly.height = opts.height;

    return poly;
  }

  type: ColliderType = ColliderType.Polygon;

  points: [number, number][] = [];
  angle: number = 0;

  // These properties only exist on Boxes, and maybe should be moved to an actual BoxCollider
  // subclass of this. Hm.
  width?: number;
  height?: number;

  init(options: Options = {}) {
    if (options.points) {
      this.points = options.points;
    }
    if (options.angle) {
      this.angle = options.angle;
    }
  }

  /**
   * Test whether a given line segment intersects with this collider.
   */
  segmentIntersects(ray: Segment) {
    if (!this.active) {
      return false;
    }

    const phys = this.getComponent(Physical);

    const points = this.points
      .map((point) => rotatePoint(point, this.angle))
      .map((point) => [point[0] + phys.center.x, point[1] + phys.center.y] as [number, number]);

    const [a, b] = ray;

    for (let pointIdx = 0; pointIdx < points.length - 1; pointIdx += 1) {
      if (crosses(a, b, points[pointIdx], points[pointIdx + 1])) {
        return true;
      }
    }

    return false;
  }

  getSATPolygon(): SAT.Polygon {
    // TODO: This part can be cached...
    const vectors = this.points.map(([x, y]) => new SAT.Vector(x, y));
    const polygon = new SAT.Polygon(new SAT.Vector(0, 0), vectors);

    // ...but this part can't!
    const {x, y} = this.getComponent(Physical).center;
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

}