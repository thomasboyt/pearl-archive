import * as SAT from 'sat';

import CollisionShape from './CollisionShape';
import { CollisionResponse, Position, Bounds, responseFromSAT } from '../utils';
import PolygonShape from './PolygonShape';

interface CircleSettings {
  radius: number;
}

export default class CircleShape extends CollisionShape {
  radius: number = 0;

  constructor(settings: CircleSettings) {
    super();
    if (settings.radius) {
      this.radius = settings.radius;
    }
  }

  getSATShape(): SAT.Circle {
    // TODO: Cache this
    const circle = new SAT.Circle(new SAT.Vector(0, 0), this.radius);
    return circle;
  }

  getBoundingBox(): Bounds {
    return {
      xMin: -this.radius,
      yMin: -this.radius,
      xMax: this.radius,
      yMax: this.radius,
    };
  }

  // TODO
  testShape(
    shape: CollisionShape,
    selfPosition: Position,
    otherPosition: Position
  ): CollisionResponse | undefined {
    const self = this.getSATShape();
    self.pos = new SAT.Vector(selfPosition.center.x, selfPosition.center.y);

    const resp = new SAT.Response();
    let collided: boolean;

    if (shape instanceof PolygonShape) {
      const otherPolygon = shape.getSATShape();
      // don't bother rotating for undefined _or_ 0, since the default is always 0
      if (otherPosition.angle) {
        otherPolygon.rotate(otherPosition.angle);
      }
      otherPolygon.translate(otherPosition.center.x, otherPosition.center.y);
      collided = SAT.testCirclePolygon(self, otherPolygon, resp);
    } else if (shape instanceof CircleShape) {
      const otherCircle = shape.getSATShape();
      otherCircle.pos = new SAT.Vector(
        otherPosition.center.x,
        otherPosition.center.y
      );
      collided = SAT.testCircleCircle(self, otherCircle, resp);
    } else {
      throw new Error('Unrecognized shape');
    }

    if (collided) {
      return responseFromSAT(resp);
    }
  }
}
