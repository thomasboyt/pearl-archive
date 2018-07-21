import Physical from '../Physical';

import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import PolygonShape from './shapes/PolygonShape';
import { Position, CollisionResponse } from './utils';

interface BoxColliderSettings {
  width: number;
  height: number;
}

/**
 * A ShapeCollider that uses a PolygonShape, but one constrained to being a
 * rectangular box.
 */
export default class BoxCollider extends ShapeCollider {
  private shape!: PolygonShape;

  get width() {
    const boundingBox = this.shape.getBoundingBox();
    return boundingBox.xMax - boundingBox.xMin;
  }

  get height() {
    const boundingBox = this.shape.getBoundingBox();
    return boundingBox.yMax - boundingBox.yMin;
  }

  create(settings: BoxColliderSettings) {
    this.shape = PolygonShape.createBox({
      width: settings.width,
      height: settings.height,
    });

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
