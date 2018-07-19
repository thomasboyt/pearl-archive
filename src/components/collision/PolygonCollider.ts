import Physical from '../Physical';

import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import PolygonShape, { BoxOptions } from './shapes/PolygonShape';
import { Position, CollisionResponse } from './utils';

interface PolygonColliderSettings {
  shape: PolygonShape;
  angle: number;
}

export default class PolygonCollider extends ShapeCollider {
  private shape!: PolygonShape;

  create(settings: PolygonColliderSettings) {
    this.shape = settings.shape;
    this.gameObject.registerCollider(this);
  }

  static createBox(opts: BoxOptions) {
    return new PolygonCollider({
      shape: PolygonShape.createBox(opts),
    });
  }

  getCollisionShape(): PolygonShape {
    return this.shape;
  }

  setBoxSize(opts: BoxOptions) {
    this.shape.setBoxSize(opts);
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
