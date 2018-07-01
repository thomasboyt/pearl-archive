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
      entity.update(dt);
    }
  }

  // TODO: Ensure entity is typed to passed constructor
  all(...tags: string[]): GameObject[] {
    const all = [...this._entities.values()];

    if (tags.length) {
      return all.filter((obj) => tags.some((tag) => obj.hasTag(tag)));
    } else {
      return all;
    }
  }

  add(entity: GameObject): GameObject {
    entity.pearl = this._pearl;
    entity.create();

    this._entities.add(entity);

    return entity;
  }

  destroy(entity: GameObject) {
    entity.onDestroy();
    this._entities.delete(entity);
  }
}
