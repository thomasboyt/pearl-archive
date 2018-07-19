import Component from '../../Component';
import Physical from '../Physical';
import ShapeCollider from './ShapeCollider';
import CollisionShape from './shapes/CollisionShape';
import { Position, CollisionResponse } from './utils';

export default abstract class Collider extends Component<any> {
  /**
   * Indicates whether this collider should be solid (objects should not go through it) or a trigger
   * (objects can go through it)
   */
  isTrigger = false;

  /**
   * Indicates whether this collider is enabled, meaning it's not ignored.
   */
  isEnabled = true;

  /**
   * Returns true if this object is colliding with the passed collider
   */
  isColliding(other: ShapeCollider): boolean {
    return this.getCollision(other) !== undefined;
  }

  /**
   * Returns a collision response for the collision between this and another collider, or null if
   * there is no collision.
   */
  getCollision(other: ShapeCollider): CollisionResponse | undefined {
    if (!this.isEnabled || !other.isEnabled) {
      return;
    }

    return this.testShape(
      other.getCollisionShape(),
      other.getComponent(Physical)
    );
  }

  abstract testShape(
    shape: CollisionShape,
    otherPosition: Position
  ): CollisionResponse | undefined;
}
