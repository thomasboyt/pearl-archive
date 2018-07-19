import Collider from './Collider';
import CollisionShape from './shapes/CollisionShape';
import { Position, CollisionResponse } from './utils';

export default class ShapeCollider extends Collider {
  getCollisionShape(): CollisionShape {
    throw new Error('not implemented');
  }

  testShape(
    shape: CollisionShape,
    otherPosition: Position
  ): CollisionResponse | undefined {
    throw new Error('not implemented');
  }
}
