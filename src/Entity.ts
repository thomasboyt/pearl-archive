import Game from './Game';
import {BoundingBox} from './Collider';
import {Coordinates} from './types';

abstract class Entity<Opts> {
  game?: Game;
  center?: Coordinates;
  size?: Coordinates;
  boundingBox: BoundingBox = BoundingBox.Rectangle;
  zIndex: number = 0;
  angle?: number;

  init(opts: Opts): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {
  }

  update(dt: number): void {
  }

  collision(other: Entity<any>): void {
  }
}

export default Entity;