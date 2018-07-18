import { Coordinates } from '../types';
import Component from '../Component';
import { addVector } from '../util/maths';

export interface PhysicalSettings {
  /**
   * The center of this object.
   */
  center?: Coordinates;

  /**
   * The angle of this object, in radians.
   */
  angle?: number;

  vel?: Coordinates;
}

/**
 * Defines the position and angle of this object.
 */
export default class Physical extends Component<PhysicalSettings> {
  private _localCenter: Readonly<Coordinates>;

  /**
   * The center of this object, relative to the world.
   */
  get center(): Readonly<Coordinates> {
    return this.localToWorld(this._localCenter);
  }

  set center(worldCenter: Readonly<Coordinates>) {
    this._localCenter = this.worldToLocal(worldCenter);
  }

  /**
   * The center of the object, relative to its parent. If it does not have a parent, or its parent
   * does not have a `Physical` component, this will be relative to the world.
   */
  get localCenter(): Readonly<Coordinates> {
    return this._localCenter;
  }

  set localCenter(val: Readonly<Coordinates>) {
    this._localCenter = val;
  }

  /**
   * The angle of this object, in radians.
   */
  angle: number;

  /**
   * A frozen object does not move, regardless of its set velocity.
   */
  frozen: boolean = false;

  /**
   * The current velocity of this object.
   */
  // TODO: This maybe belongs somewhere else? Especially if it's going to be this generic?
  vel: Coordinates = {
    x: 0,
    y: 0,
  };

  translate(vec: Coordinates) {
    this.center = addVector(this.center, vec);
  }

  worldToLocal(worldPos: Coordinates): Coordinates {
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

  localToWorld(localPos: Coordinates): Coordinates {
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
    return (
      this.gameObject.parent &&
      this.gameObject.parent.maybeGetComponent(Physical)
    );
  }

  create(settings: PhysicalSettings = {}) {
    if (settings.center) {
      this.center = settings.center;
    }

    if (settings.vel) {
      this.vel = settings.vel;
    }

    this.angle = settings.angle || 0;
  }

  update(dt: number) {
    if (!this.frozen) {
      // TODO: Use angle here
      this.translate({
        x: this.vel.x * dt,
        y: this.vel.y * dt,
      });
    }
  }
}
