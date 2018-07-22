import Entity from './Entity';
import PearlInstance from './PearlInstance';

export default class EntityManager {
  private _pearl: PearlInstance;

  private _entities: Set<Entity> = new Set();

  constructor(pearl: PearlInstance) {
    this._pearl = pearl;
  }

  update(dt: number) {
    const frameEntities = [...this._entities];

    const uninstantiated = frameEntities.filter(
      (entity) => entity.state === 'created'
    );

    for (let entity of uninstantiated) {
      entity.initialize();
    }

    for (let entity of frameEntities) {
      entity.update(dt);
    }
  }

  all(...tags: string[]): Entity[] {
    // TODO: THIS IS KINDA HACKY LOL Prevent rendering or use of objects that have not been
    // instantiated yet
    const all = [...this._entities.values()].filter((entity) => {
      return entity.state === 'initialized';
    });

    if (tags.length) {
      return all.filter((entity) => tags.some((tag) => entity.hasTag(tag)));
    } else {
      return all;
    }
  }

  add(entity: Entity): Entity {
    entity.pearl = this._pearl;
    entity.create();

    this._entities.add(entity);

    return entity;
  }

  destroy(entity: Entity) {
    entity.onDestroy();
    this._entities.delete(entity);
  }
}
