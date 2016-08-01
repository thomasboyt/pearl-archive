import GameObject from './GameObject';
import PearlInstance from './PearlInstance';

export default class EntityManager {
  private _pearl: PearlInstance;

  private _entities: Set<GameObject> = new Set();

  constructor(pearl: PearlInstance) {
    this._pearl = pearl;
  }

  update(dt: number) {
    // We call this.all() here so that if any entities are created or destroyed during the update()
    // cycle, it doesn't affect our iteration
    for (let entity of this.all()) {
      if (entity.update) {
        entity.update(dt);
      }
    }
  }

  // TODO: Ensure entity is typed to passed constructor
  all(Constructor?: Function): Set<GameObject> {
    // TODO: why doesn't this work
    if (!Constructor) {
      return new Set(this._entities);  // shallow clone
    }

    return new Set(
      [...(this._entities)]
      .filter((entity) => entity instanceof Constructor!)
    );
  }

  add(entity: GameObject): GameObject {
    entity.pearl = this._pearl;
    entity.init();

    this._entities.add(entity);
    this._pearl.collider.addEntity(entity);

    return entity;
  }

  destroy(entity: GameObject) {
    entity.onDestroy();
    this._entities.delete(entity);
    this._pearl.collider.destroyEntity(entity);
  }
}
