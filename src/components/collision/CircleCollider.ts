import Physical from '../Physical';

import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import CircleShape from './shapes/CircleShape';
import { Position, CollisionResponse } from './utils';

interface CircleColliderSettings {
  shape: CircleShape;
}

export default class CircleCollider extends ShapeCollider {
  private shape!: CircleShape;

  create(settings: CircleColliderSettings) {
    this.shape = settings.shape;
    this.gameObject.registerCollider(this);
  }

  getCollisionShape(): CircleShape {
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
