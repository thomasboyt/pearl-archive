import Physical from '../Physical';

import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import PolygonShape from './shapes/PolygonShape';
import { Position, CollisionResponse } from './utils';

interface PolygonColliderSettings {
  shape: PolygonShape;
}

export default class PolygonCollider extends ShapeCollider {
  private shape!: PolygonShape;

  create(settings: PolygonColliderSettings) {
    this.shape = settings.shape;
    this.gameObject.registerCollider(this);
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
