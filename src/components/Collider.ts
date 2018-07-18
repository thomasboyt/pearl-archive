import * as SAT from 'sat';

import Component from '../Component';
import GameObject from '../GameObject';

export interface CollisionResponse {
  overlap: number;
  overlapVector: [number, number];
  aInB: boolean;
  bInA: boolean;
}

// Sooo we can't use instanceof Circle/instanceof Polygon internally because it creates a circular
// dependency, so this little type enum is used to check what we're referencing in getCollision()
export enum ColliderType {
  Polygon,
  Circle,
}

export interface ICollider extends Component<any> {
  isTrigger: boolean;
  isEnabled: boolean;
  isColliding(other: ICollider): boolean;
  getCollision(other: ICollider): CollisionResponse | null;
  // maybe:
  // testSATPolygon(other: SAT.Polygon): SAT.Response | undefined;
  // testSATCircle(other: SAT.Circle): SAT.Response | undefined;
}

export class CollisionInformation {
  collider: ICollider;
  gameObject: GameObject;
  response: CollisionResponse;

  constructor(collider: ICollider, response: CollisionResponse) {
    this.collider = collider;
    this.gameObject = collider.gameObject;
    this.response = response;
  }

  static invertResponse(response: CollisionResponse): CollisionResponse {
    return {
      aInB: response.bInA,
      bInA: response.aInB,
      overlap: -response.overlap,
      overlapVector: [-response.overlapVector[0], -response.overlapVector[1]],
    };
  }
}

abstract class Collider<T> extends Component<any> {
  abstract type: ColliderType;

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
  isColliding(other: Collider<any>): boolean {
    return this.getCollision(other) !== null;
  }

  /**
   * Returns a collision response for the collision between this and another collider, or null if
   * there is no collision.
   */
  getCollision(other: Collider<any>): CollisionResponse | null {
    if (!this.isEnabled || !other.isEnabled) {
      return null;
    }

    if (other.type === ColliderType.Polygon) {
      return this.testPolygon(other);
    } else if (other.type === ColliderType.Circle) {
      return this.testCircle(other);
    } else {
      throw new Error(`unrecognized collider type: ${other}`);
    }
  }

  protected responseFromSAT(response: SAT.Response): CollisionResponse {
    const vector: [number, number] = [response.overlapV.x, response.overlapV.y];

    return {
      overlap: response.overlap,
      overlapVector: vector,
      aInB: response.aInB,
      bInA: response.bInA,
    };
  }

  protected abstract testPolygon(
    other: Collider<any>
  ): CollisionResponse | null;
  protected abstract testCircle(other: Collider<any>): CollisionResponse | null;
}

export default Collider;
