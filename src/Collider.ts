import PearlInstance from './PearlInstance';
import GameObject from './GameObject';

import {
  getBoundingBox,
  rectanglesIntersecting,
  circleAndRectangleIntersecting,
  circlesIntersecting,
} from './util/maths';

export enum BoundingBox {
  Rectangle = 0,
  Circle = 1,
}

function isSetupForCollisions(obj: GameObject) {
  return obj.center !== undefined && obj.size !== undefined;
}

function notifyEntityOfCollision(entity: GameObject, other: GameObject): void {
  entity.collision(other);
};

export default class Collider {
  private _pearl: PearlInstance;
  private _currentCollisionPairs: [GameObject, GameObject][] = [];

  constructor(pearl: PearlInstance) {
    this._pearl = pearl;
  }

  update() {
    this._currentCollisionPairs = [];

    // add every pair of entities to test
    // TODO: Is there a way to do this without casting to an array?
    const ent = [...this._pearl.entities.all()];

    for (let i = 0; i < ent.length; i += 1) {
      for (let j = i + 1; j < ent.length;  j += 1) {
        this._currentCollisionPairs.push([ent[i], ent[j]]);
      }
    }

    // We do this weird-looking iteration this way because entities can be destroyed during the
    // collision cycle, which means that we need to remove those entities from any further collision
    // tests.
    while (this._currentCollisionPairs.length > 0) {
      const [entity1, entity2] = this._currentCollisionPairs.shift()!;

      if (this.isColliding(entity1, entity2)) {
        this.collision(entity1, entity2);
      }
    }
  }

  collision(entity1: GameObject, entity2: GameObject) {
    notifyEntityOfCollision(entity1, entity2);
    notifyEntityOfCollision(entity2, entity1);
  }

  addEntity(entity: GameObject) {
    // When an entity is added, it's immediately added to the current collision pairs
    for (let other of this._pearl.entities.all()) {
      if (entity !== other) {
        this._currentCollisionPairs.push([entity, other]);
      }
    }
  }

  destroyEntity(entity: GameObject) {
    // Remove any collision pairs that include the destroyed entity
    this._currentCollisionPairs = this._currentCollisionPairs.filter((pair) => {
      return !(pair[0] === entity || pair[1] === entity);
    });
  }

  isColliding(obj1: GameObject, obj2: GameObject) {
    return obj1 !== obj2 &&
      isSetupForCollisions(obj1) &&
      isSetupForCollisions(obj2) &&
      this.isIntersecting(obj1, obj2);
  }

  isIntersecting(obj1: GameObject, obj2: GameObject) {
    const obj1BoundingBox = getBoundingBox(obj1);
    const obj2BoundingBox = getBoundingBox(obj2);

    if (obj1BoundingBox === BoundingBox.Rectangle && obj2BoundingBox === BoundingBox.Rectangle) {
      return rectanglesIntersecting(obj1, obj2);

    } else if (obj1BoundingBox === BoundingBox.Circle &&
               obj2BoundingBox === BoundingBox.Rectangle) {
      return circleAndRectangleIntersecting(obj1, obj2);
    } else if (obj1BoundingBox === BoundingBox.Rectangle &&
               obj2BoundingBox === BoundingBox.Circle) {
      return circleAndRectangleIntersecting(obj2, obj1);

    } else if (obj1BoundingBox === BoundingBox.Circle && obj2BoundingBox === BoundingBox.Circle) {
      return circlesIntersecting(obj1, obj2);

    } else {
      throw new Error('Objects being collision tested have unsupported bounding box types.');
    }
  }
}