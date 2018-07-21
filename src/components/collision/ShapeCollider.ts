import Collider from './Collider';
import CollisionShape from './shapes/CollisionShape';
import { Position, CollisionResponse, Bounds } from './utils';
import Physical from '../Physical';

/**
 * A ShapeCollider is the base class for any collider that represents a
 * CollisionShape.
 *
 * **WARNING**: This is an abstract collider that should not be instantiated
 * directly. It's only concrete so that `instanceof ShapeCollider` can be used
 * to check whether a given collider is a ShapeCollider.
 */
export default class ShapeCollider extends Collider {
  getCollisionShape(): CollisionShape {
    throw new Error('not implemented');
  }

  /**
   * Return the bounds of this collider's shape, translated by the collider's
   * center.
   *
   * **TODO**: Account for rotation.
   */
  getBounds(): Bounds {
    const bounds = this.getCollisionShape().getBoundingBox();

    const center = this.getComponent(Physical).center;

    return {
      xMin: bounds.xMin + center.x,
      yMin: bounds.yMin + center.y,
      xMax: bounds.xMax + center.x,
      yMax: bounds.yMax + center.y,
    };
  }

  /**
   * Return the bounds of this collider's shape, relative to this entity's local
   * center.
   */
  getLocalBounds(): Bounds {
    const bounds = this.getBounds();
    const phys = this.getComponent(Physical);

    const min = phys.worldToLocal({ x: bounds.xMin, y: bounds.yMin });
    const max = phys.worldToLocal({ x: bounds.xMax, y: bounds.yMax });

    return {
      xMin: min.x,
      xMax: max.x,
      yMin: min.y,
      yMax: max.y,
    };
  }

  testShape(
    shape: CollisionShape,
    otherPosition: Position
  ): CollisionResponse | undefined {
    throw new Error('not implemented');
  }
}
