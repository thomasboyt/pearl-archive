import GameObject from './GameObject';
import PearlInstance from './PearlInstance';

abstract class Component<Settings> {
  gameObject: GameObject;

  initialSettings?: Settings;

  constructor(settings?: Settings) {
    this.initialSettings = settings;
  }

  // public hooks

  init(settings: Settings) {
    // no-op
  }

  update(dt: number) {
    // no-op
  }

  render(ctx: CanvasRenderingContext2D) {
    // no-op
  }

  onDestroy() {
    // no-op
  }

  /*
   * Convenience stuff that maps back to gameObject
   */

  get pearl(): PearlInstance {
    return this.gameObject.pearl;
  }

  getComponent<T extends Component<any>>(componentType: {new(...args: any[]): T}): T {
    return this.gameObject.getComponent(componentType);
  }
}

export default Component;
