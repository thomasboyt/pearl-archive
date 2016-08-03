import {Coordinates} from '../types';
import Component from '../Component';

export interface PhysicalSettings {
  /**
   * The center of this object.
   */
  center?: Coordinates;

  /**
   * The angle of this object, in radians.
   */
  angle?: number;
}

/**
 * Defines the position and angle of this object.
 */
export default class Physical extends Component<PhysicalSettings> {
  /**
   * The center of this object.
   */
  center: Coordinates;

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

  init(settings: PhysicalSettings = {}) {
    if (settings.center) {
      this.center = settings.center;
    }

    this.angle = settings.angle || 0;
  }

  update(dt: number) {
    if (!this.frozen) {
      // TODO: Use angle here
      this.center.x += this.vel.x * dt;
      this.center.y += this.vel.y * dt;
    }
  }
}
