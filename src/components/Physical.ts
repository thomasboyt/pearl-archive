import {Coordinates} from '../types';
import {BoundingBox} from '../Collider';
import GameObject from '../GameObject';
import Component from '../Component';

export interface PhysicalSettings {
  center?: Coordinates;
  size?: Coordinates;
}

export default class Physical extends Component<PhysicalSettings> {
  center: Coordinates;
  size: Coordinates;
  angle: number;
  boundingBox: BoundingBox = BoundingBox.Rectangle;

  frozen: boolean = false;

  // TODO: This maybe belongs somewhere else? Especially if it's going to be this generic?
  vel: Coordinates = {
    x: 0,
    y: 0,
  };

  init(settings: PhysicalSettings = {}) {
    if (settings.center) {
      this.center = settings.center;
    }
    if (settings.size) {
      this.size = settings.size;
    }
  }

  update(dt: number) {
    if (!this.frozen) {
      this.center.x += this.vel.x * dt;
      this.center.y += this.vel.y * dt;
    }
  }
}
