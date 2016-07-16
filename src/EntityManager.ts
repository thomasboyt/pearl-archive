import Entity from './Entity';
import Game from './Game';

export default class EntityManager {
  private _game: Game;

  private _entities: Set<Entity<any>> = new Set();

  constructor(game: Game) {
    this._game = game;
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
  all(Constructor?: Function): Set<Entity<any>> {
    // TODO: why doesn't this work
    if (!Constructor) {
      return new Set(this._entities);  // shallow clone
    }

    return new Set(
      [...(this._entities)]
      .filter((entity) => entity instanceof Constructor!)
    );
  }

  // TODO: This doesn't properly type-check options. It does ensure the passed options are the
  // correct type, but not for the presence of options, nor does it error if extra options are
  // passed. Why?
  add<T, P extends Entity<T>>(entity: P, opts: T): P {
    entity.game = this._game;
    entity.init(opts);

    this._entities.add(entity);
    this._game.collider.addEntity(entity);

    return entity;
  }

  destroy(entity: Entity<any>) {
    this._entities.delete(entity);
    this._game.collider.destroyEntity(entity);
  }
}