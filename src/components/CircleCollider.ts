import * as SAT from 'sat';

import Component from '../Component';
import Physical from './Physical';
import PolygonCollider from './PolygonCollider';

export type Collider = PolygonCollider | CircleCollider;

export interface Options {
  radius?: number;
}

export default class CircleCollider extends Component<Options> {
  radius: number;

  active: boolean = true;

  init(options: Options = {}) {
    if (options.radius) {
      this.radius = options.radius;
    }
  }

  isColliding(other: PolygonCollider | CircleCollider): boolean {
    if (!this.active || !other.active) {
      return false;
    }

    if (other instanceof PolygonCollider) {
      return this.testPolygon(other);
    } else if (other instanceof CircleCollider) {
      return this.testCircle(other);
    } else {
      throw new Error(`unrecognized collider type: ${other}`);
    }
  }

  testPolygon(other: PolygonCollider): boolean {
    const selfCircle = this.getSATCircle();
    const otherPoly = other.getSATPolygon();

    return SAT.testCirclePolygon(selfCircle, otherPoly);
  }

  testCircle(other: CircleCollider): boolean {
    const selfCircle = this.getSATCircle();
    const otherCircle = other.getSATCircle();

    return SAT.testCircleCircle(selfCircle, otherCircle);
  }

  getSATCircle(): SAT.Circle {
    const {x, y} = this.getComponent(Physical).center;
    const circle = new SAT.Circle(new SAT.Vector(x, y), this.radius);
    return circle;
  }

}