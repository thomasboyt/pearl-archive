import * as SAT from 'sat';

import { CollisionResponse, Position, Bounds } from '../utils';

export default class CollisionShape {
  getSATShape(): SAT.Polygon | SAT.Circle {
    throw new Error('not implemented');
  }

  getBoundingBox(): Bounds {
    throw new Error('not implemented');
  }

  testShape(
    shape: CollisionShape,
    selfPosition: Position,
    otherPosition: Position
  ): CollisionResponse | undefined {
    throw new Error('not implemented');
  }
}
