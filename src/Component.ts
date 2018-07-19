import GameObject from './GameObject';
import PearlInstance from './PearlInstance';
import { Yieldable } from '@tboyt/coroutine-manager';
import CollisionInformation from './components/collision/CollisionInformation';

/**
 * A base class for components. The component's options interface should be passed as a type
 * argument when sublcassing, so that the options interface is correctly type-checked when this
 * component is instantiated.
 */
abstract class Component<Settings> {
  initialSettings?: Settings;

  /**
   * The gameObject that this component is attached to.
   */
  gameObject: GameObject;

  /**
   * Whether this component's render() should be skipped.
   */
  isVisible: boolean = true;

  constructor(settings?: Settings) {
    this.initialSettings = settings;
  }

  /*
   * Public hooks
   */

  /**
   * Hook called when this object is created with its passed-in settings.
   */
  create(settings: Settings) {
    // no-op
  }

  /**
   * Hook called when this object is added to the world.
   */
  init(settings: Settings) {
    // no-op
  }

  /**
   * Hook called on every frame, with the delta-time (in milliseconds) since the last frame.
   */
  update(dt: number) {
    // no-op
  }

  /**
   * Hook called to draw to the canvas on every frame. Any drawing operations in this function are
   * wrapped with calls to ctx.save()/ctx.restore() to prevent inadvertantly relying on
   * previously-set canvas state.
   */
  render(ctx: CanvasRenderingContext2D) {
    // no-op
  }

  /**
   * Hook called when this object is destroyed.
   */
  onDestroy() {
    // no-op
  }

  /**
   * Hook called when this object is collided with.
   */
  onCollision(collision: CollisionInformation) {
    // no-op
  }

  /*
   * Convenience stuff that maps back to gameObject
   */

  /**
   * Return the current Pearl instance.
   */
  get pearl(): PearlInstance {
    return this.gameObject.pearl;
  }

  /**
   * Get a sibling component on the same object by type.
   */
  getComponent<T extends Component<any>>(componentType: {
    new (...args: any[]): T;
  }): T {
    return this.gameObject.getComponent(componentType);
  }

  runCoroutine(
    generatorFn: () => IterableIterator<Yieldable>
  ): IterableIterator<undefined> {
    return this.gameObject.runCoroutine(generatorFn.bind(this));
  }

  cancelCoroutine(coroutine: IterableIterator<undefined>) {
    this.gameObject.cancelCoroutine(coroutine);
  }
}

export default Component;
