import Collider from './Collider';
import CollisionShape from './shapes/CollisionShape';
import { Position, CollisionResponse, Bounds } from './utils';
import Physical from '../Physical';

export default class ShapeCollider extends Collider {
  getCollisionShape(): CollisionShape {
    throw new Error('not implemented');
  }

  getBounds(): Bounds {
    const bounds = this.getCollisionShape().getBoundingBox();

    const center = this.getComponent(Physical).center;

    return {
      xMin: bounds.xMin + center.x,
      yMin: bounds.yMin + center.y,
      xMax: bounds.xMax + center.x,
      yMax: bounds.yMax + center.y,
    };
  }

  getLocalBounds(): Bounds {
    const bounds = this.getBounds();
    const phys = this.getComponent(Physical);

    const min = phys.worldToLocal({ x: bounds.xMin, y: bounds.yMin });
    const max = phys.worldToLocal({ x: bounds.xMax, y: bounds.yMax });

    return {
      xMin: min.x,
      xMax: max.x,
      yMin: min.y,
      yMax: max.y,
    };
  }

  testShape(
    shape: CollisionShape,
    otherPosition: Position
  ): CollisionResponse | undefined {
    throw new Error('not implemented');
  }
}
