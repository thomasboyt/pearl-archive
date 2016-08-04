import * as SAT from 'sat';

import Component from '../Component';

export interface CollisionResponse {
  overlap: number;
  overlapVector: [number, number];
}

// Sooo we can't use instanceof Circle/instanceof Polygon internally because it creates a circular
// dependency, so this little type enum is used to check what we're referencing in getCollision()
export enum ColliderType {
  Polygon,
  Circle,
}

abstract class Collider<T> extends Component<any> {
  abstract type: ColliderType;

  active: boolean = true;

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
    if (!this.active || !other.active) {
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
    };
  }

  protected abstract testPolygon(other: Collider<any>): CollisionResponse | null;
  protected abstract testCircle(other: Collider<any>): CollisionResponse | null;
}

export default Collider;