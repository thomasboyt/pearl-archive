import Physical from '../Physical';

import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import PolygonShape from './shapes/PolygonShape';
import { Position, CollisionResponse } from './utils';

interface PolygonColliderSettings {
  points: [number, number][];
}

/**
 * A ShapeCollider with a PolygonShape, representing a convex polygon.
 */
export default class PolygonCollider extends ShapeCollider {
  private shape!: PolygonShape;

  create(settings: PolygonColliderSettings) {
    this.shape = new PolygonShape({
      points: settings.points,
    });

    this.entity.registerCollider(this);
  }

  getCollisionShape(): PolygonShape {
    return this.shape;
  }

  testShape(
    shape: CollisionShape,
    otherPosition: Position
  ): CollisionResponse | undefined {
    return this.shape.testShape(
      shape,
      this.getComponent(Physical),
      otherPosition
    );
  }
}
