import Game from './Game';
import {BoundingBox} from './Collider';
import {Coordinates} from './types';

abstract class Entity {
  game?: Game;
  center?: Coordinates;
  size?: Coordinates;
  boundingBox: BoundingBox = BoundingBox.Rectangle;
  zIndex: number = 0;
  angle?: number;

  draw(ctx: CanvasRenderingContext2D): void {
  }

  update(dt: number): void {
  }

  collision(other: Entity): void {
  }
}

export default Entity;