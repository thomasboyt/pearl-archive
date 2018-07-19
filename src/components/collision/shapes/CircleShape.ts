import * as SAT from 'sat';

import CollisionShape from './CollisionShape';
import { CollisionResponse, Position } from '../utils';

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

  // TODO
  testShape(
    shape: CollisionShape,
    selfPosition: Position,
    otherPosition: Position
  ): CollisionResponse | undefined {
    throw new Error('not implemented');
  }
}
