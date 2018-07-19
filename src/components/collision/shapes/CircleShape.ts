import * as SAT from 'sat';

import CollisionShape from './CollisionShape';
import { CollisionResponse, Position, Bounds } from '../utils';

interface CircleSettings {
  radius: number;
}

export default class CircleShape extends CollisionShape {
  radius: number = 0;

  create(settings: CircleSettings) {
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
    throw new Error('not implemented');
  }
}
