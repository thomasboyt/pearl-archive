import Entity from './Entity';
import PearlInstance from './PearlInstance';
import { Runnable } from '@tboyt/coroutine-manager';
import CollisionInformation from './components/collision/CollisionInformation';

/**
 * A base class for components. The component's options interface should be
 * passed as a type argument when sublcassing, so that the options interface is
 * correctly type-checked when this component is instantiated.
 */
abstract class Component<Settings> {
  initialSettings?: Settings;

  /**
   * The entity that this component is attached to.
   */
  entity: Entity;

  /**
   * @deprecated
   */
  get gameObject() {
    return this.entity;
  }

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
   * Hook called on every frame, with the delta-time (in milliseconds) since the
   * last frame.
   */
  update(dt: number) {
    // no-op
  }

  /**
   * Hook called to draw to the canvas on every frame. Any drawing operations in
   * this function are wrapped with calls to ctx.save()/ctx.restore() to prevent
   * inadvertantly relying on previously-set canvas state.
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
   * Convenience stuff that maps back to entity
   */

  /**
   * Return the current Pearl instance.
   */
  get pearl(): PearlInstance {
    return this.entity.pearl;
  }

  /**
   * Get a sibling component on the same object by type.
   */
  getComponent<T extends Component<any>>(componentType: {
    new (...args: any[]): T;
  }): T {
    return this.entity.getComponent(componentType);
  }

  runCoroutine(generator: Runnable): IterableIterator<undefined> {
    if (typeof generator === 'function') {
      generator = generator.bind(this);
    }
    return this.entity.runCoroutine(generator);
  }

  cancelCoroutine(coroutine: IterableIterator<undefined>) {
    this.entity.cancelCoroutine(coroutine);
  }
}

export default Component;
