import * as SAT from 'sat';

import Physical from './Physical';
import PolygonCollider from './PolygonCollider';
import Collider, {CollisionResponse, ColliderType} from './Collider';

export interface Options {
  radius?: number;
}

export default class CircleCollider extends Collider<Options> {
  type: ColliderType = ColliderType.Polygon;

  radius: number;

  init(options: Options = {}) {
    if (options.radius) {
      this.radius = options.radius;
    }
  }

  getSATCircle(): SAT.Circle {
    const {x, y} = this.getComponent(Physical).center;
    const circle = new SAT.Circle(new SAT.Vector(x, y), this.radius);
    return circle;
  }

  protected testPolygon(other: PolygonCollider): CollisionResponse | null {
    const selfCircle = this.getSATCircle();
    const otherPoly = other.getSATPolygon();

    const resp = new SAT.Response();
    const collided = SAT.testCirclePolygon(selfCircle, otherPoly, resp);

    if (collided) {
      return this.responseFromSAT(resp);
    } else {
      return null;
    }
  }

  protected testCircle(other: CircleCollider): CollisionResponse | null {
    const selfCircle = this.getSATCircle();
    const otherCircle = other.getSATCircle();

    const resp = new SAT.Response();
    const collided = SAT.testCircleCircle(selfCircle, otherCircle, resp);

    if (collided) {
      return this.responseFromSAT(resp);
    } else {
      return null;
    }
  }

}