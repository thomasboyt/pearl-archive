import Physical from '../Physical';

import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import CircleShape from './shapes/CircleShape';
import { Position, CollisionResponse } from './utils';

interface CircleColliderSettings {
  radius: number;
}

/**
 * A ShapeCollider that uses a CircleShape.
 */
export default class CircleCollider extends ShapeCollider {
  private shape!: CircleShape;

  create(settings: CircleColliderSettings) {
    this.shape = new CircleShape({
      radius: settings.radius,
    });

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
