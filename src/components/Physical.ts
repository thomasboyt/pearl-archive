import Component from '../Component';
import { Vector2 } from '../types';
import * as V from '../util/vectorMaths';

export interface PhysicalSettings {
  /**
   * The center of this object.
   */
  center?: Vector2;

  /**
   * The angle of this object, in radians.
   */
  angle?: number;
}

/**
 * Defines the position and angle of this object.
 */
export default class Physical extends Component<PhysicalSettings> {
  private _localCenter: Vector2;

  /**
   * The center of this object, relative to the world.
   */
  get center(): Vector2 {
    return this.localToWorld(this._localCenter);
  }

  set center(worldCenter: Vector2) {
    this._localCenter = this.worldToLocal(worldCenter);
  }

  /**
   * The center of the object, relative to its parent. If it does not have a parent, or its parent
   * does not have a `Physical` component, this will be relative to the world.
   */
  get localCenter(): Vector2 {
    return this._localCenter;
  }

  set localCenter(val: Vector2) {
    this._localCenter = val;
  }

  /**
   * The angle of this object, in radians.
   */
  angle: number;

  translate(vec: Vector2) {
    this.center = V.add(this.center, vec);
  }

  worldToLocal(worldPos: Vector2): Vector2 {
    const parent = this.getParentPhys();

    if (!parent) {
      return worldPos;
    } else {
      return {
        x: worldPos.x - parent.center.x,
        y: worldPos.y - parent.center.y,
      };
    }
  }

  localToWorld(localPos: Vector2): Vector2 {
    const parent = this.getParentPhys();

    if (!parent) {
      return localPos;
    } else {
      return {
        x: localPos.x + parent.center.x,
        y: localPos.y + parent.center.y,
      };
    }
  }

  private getParentPhys(): Physical | null {
    return this.entity.parent && this.entity.parent.maybeGetComponent(Physical);
  }

  create(settings: PhysicalSettings = {}) {
    if (settings.center) {
      this.center = settings.center;
    }

    this.angle = settings.angle || 0;
  }
}
