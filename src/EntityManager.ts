import Entity from './Entity';
import Game from './Game';

export default class EntityManager {
  private _game: Game;

  private _entities: Set<Entity> = new Set();

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
  all(Constructor?: Function): Set<Entity> {
    // TODO: why doesn't this work
    if (!Constructor) {
      return new Set(this._entities);  // shallow clone
    }

    return new Set(
      [...(this._entities)]
      .filter((entity) => entity instanceof Constructor!)
    );
  }

  add(entity: Entity) {
    entity.game = this._game;

    this._entities.add(entity);
    this._game.collider.addEntity(entity);
  }

  destroy(entity: Entity) {
    this._entities.delete(entity);
    this._game.collider.destroyEntity(entity);
  }
}