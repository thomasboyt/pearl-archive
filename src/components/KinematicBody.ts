import Component from '../Component';
import Physical from './Physical';
import { Vector2 } from '../types';

import Collider from './collision/Collider';
import { CollisionResponse } from './collision/utils';
import ShapeCollider from './collision/ShapeCollider';
import CollisionInformation from './collision/CollisionInformation';
import { uniqBy } from 'lodash-es';

export default class KinematicBody extends Component<null> {
  moveAndCollide(vec: Vector2): CollisionInformation[] {
    const collisions = this._moveAndCollide(vec);
    this.fireCollisions(collisions);
    return collisions;
  }

  private _moveAndCollide(vec: Vector2): CollisionInformation[] {
    const phys = this.getComponent(Physical);

    phys.translate(vec);

    const collisions = this.getCollisions();

    const solidCollisions = collisions.filter(
      (collision) => !collision.collider.isTrigger
    );

    if (solidCollisions.length > 0) {
      for (let collision of solidCollisions) {
        const collision = solidCollisions[0];
        const overlap = collision.response.overlapVector;
        phys.translate({ x: -overlap.x, y: -overlap.y });
      }
    }

    return collisions;
  }

  // TODO: This doesn't quite "slide" the way it probably should yet. A true
  // slide would be that, if e.g. you were going northeast and were blocked by a
  // wall on the west, you would then slide north with the _full magnitude of
  // your velocity_, rather than _just the x component_ as happens here.
  //
  // Godot does this by saying "if there's a collision, use
  // `velocity.slide(collision.normal)`", but I'm not sure how this works when
  // it's possible to have multiple collisions at once.
  //
  // Notably, fixing this would solve some bugs around moving around corners, I
  // think? Especially for AI.
  moveAndSlide(vec: Vector2): CollisionInformation[] {
    const xCollisions = this._moveAndCollide({ x: vec.x, y: 0 });
    const yCollisions = this._moveAndCollide({ x: 0, y: vec.y });

    // TODO:
    //
    // Currently this only fires a single onCollision() for a collision on both
    // axes, but returns CollisionInfo for both collisions.
    //
    // This is normally okay behavior, but could run into trouble if you wanted
    // to do something with the full overlap vector in the onCollision() hook.
    // It might be possible to solve this by merging the overlap vectors if you
    // are overlapping twice with the same entity?
    const collisions = [...xCollisions, ...yCollisions];
    const dedupedCollisions = uniqBy(
      collisions,
      (collision) => collision.entity
    );
    this.fireCollisions(dedupedCollisions);
    return collisions;
  }

  private fireCollisions(collisions: CollisionInformation[]) {
    for (let collision of collisions) {
      this.entity.onCollision(collision);
      collision.collider.entity.onCollision(
        new CollisionInformation(
          this.entity.collider,
          CollisionInformation.invertResponse(collision.response)
        )
      );
    }
  }

  private getCollisions() {
    const thisCollider = this.entity.collider;

    if (!(thisCollider instanceof ShapeCollider)) {
      throw new Error(
        'KinematicBody requires a PolygonCollider, BoxCollider, or CircleCollider to be attached'
      );
    }

    const colliders = this.pearl.entities
      .all()
      .filter((entity) => entity !== this.entity)
      .map((entity) => entity.collider)
      .filter((collider) => collider) as Collider[];

    return colliders
      .map((collider) => {
        const isTrigger = collider.isTrigger;
        const response = collider.getCollision(thisCollider);

        if (!response) {
          return null;
        }

        const collisionInformation = new CollisionInformation(
          collider,
          CollisionInformation.invertResponse(response)
        );

        return collisionInformation;
      })
      .filter((collision) => collision !== null) as CollisionInformation[];
  }
}
