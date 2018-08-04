import * as uuidv4 from 'uuid/v4';

import Component from './Component';
import PearlInstance from './PearlInstance';
import CoroutineManager, { Runnable } from '@tboyt/coroutine-manager';
import Collider from './components/collision/Collider';
import CollisionInformation from './components/collision/CollisionInformation';

export interface CreateOpts {
  /**
   * The name of this Entity, used to for displaying in debug tools.
   */
  name: string;

  /**
   * The components attached to this Entity
   */
  components: Component<any>[];

  /**
   * The z-layer that this Entity's components should render at. Defaults to 0,
   * except for the root Entity, which defaults to -1.
   */
  zIndex?: number;

  /**
   * Tags attached to this Entity (see hasTag())
   */
  tags?: string[];
}

export type EntityState = 'new' | 'created' | 'initialized' | 'destroyed';

/**
 * A Entity is an entity in the world that holds a collection of components.
 *
 * It is instantiated directly, but is not registered in the world until passed
 * to pearl.entities.add() or entity.addChild().
 */
export default class Entity {
  pearl: PearlInstance;

  zIndex: number = 0;

  id = uuidv4();

  readonly name: string;
  private tags: string[] = [];

  // TODO: maybe make this frozen to the outside world
  components: Component<any>[] = [];

  private _state: EntityState = 'new';
  get state() {
    return this._state;
  }

  constructor(opts: CreateOpts) {
    this.name = opts.name;

    for (let component of opts.components) {
      this.addComponent(component);
    }

    if (opts.zIndex !== undefined) {
      this.zIndex = opts.zIndex;
    }

    if (opts.tags !== undefined) {
      this.tags = opts.tags;
    }
  }

  addComponent(component: Component<any>) {
    if (this._state !== 'new') {
      throw new Error(
        'cannot add components to an entity that has already been added to the game world'
      );
    }
    component.entity = this;
    this.components.push(component);
  }

  /**
   * Called before the first frame for new entities
   *
   * @internal
   */
  initialize() {
    for (let component of this.components) {
      component.init(component.initialSettings);
    }

    this._state = 'initialized';
  }

  /**
   * Check whether this component has the specified tag.
   */
  hasTag(tag: string): boolean {
    // TODO: probably use a Set or Map for this
    return this.tags.some((val) => val === tag);
  }

  maybeGetComponent<T extends Component<any>>(componentType: {
    new (...args: any[]): T;
  }): T | null {
    const c = this.components.find(
      (component) => component instanceof componentType
    );

    if (!c) {
      return null;
    }

    // TODO: TypeScript doesn't know that c here is instanceof componentType,
    // for some reason, so we unfortunately have to hard-cast here
    return c as T;
  }

  getComponent<T extends Component<any>>(componentType: {
    new (...args: any[]): T;
  }): T {
    const c = this.maybeGetComponent(componentType);

    if (!c) {
      throw new Error(`could not find component of type ${componentType.name}`);
    }

    return c;
  }

  /* Object tree system */

  // top-level game object doesn't have a parent
  private _parent: Entity | null = null;
  private _children: Set<Entity> = new Set();

  /**
   * This Entity's child entities.
   *
   * This Set should not be mutated (use `addChild` instead)!
   */
  get children(): Set<Entity> {
    return this._children;
  }

  /**
   * This Entity's parent Entity, or null if it is a top-level object.
   */
  get parent(): Entity | null {
    return this._parent;
  }

  private setParent(parent: Entity) {
    this._parent = parent;
  }

  /**
   * Instantiates a passed Entity and adds it as a child object to this Entity.
   *
   * Returns the Entity for convenience.
   *
   * @deprecated
   */
  addChild(child: Entity): Entity {
    child.setParent(this);
    this._children.add(child);
    this.pearl.entities.add(child);
    return child;
  }

  /**
   * Adds an existing child object to this object's children, and update the
   * parent of the child.
   */
  appendChild(child: Entity) {
    child.setParent(this);
    this._children.add(child);
  }

  private removeChild(child: Entity) {
    this._children.delete(child);
  }

  /*
   * Internal hooks
   */

  create() {
    this._state = 'created';

    // game is set at this point
    for (let component of this.components) {
      component.create(component.initialSettings);
    }
  }

  update(dt: number) {
    for (let component of this.components) {
      component.update(dt);
    }

    this.coroutineManager.tick();
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let component of this.components) {
      if (!component.isVisible) {
        continue;
      }

      ctx.save();
      component.render(ctx);
      ctx.restore();
    }
  }

  onCollision(collision: CollisionInformation) {
    for (let component of this.components) {
      component.onCollision(collision);
    }
  }

  onDestroy() {
    for (let component of this.components) {
      component.onDestroy();
    }

    // remove relation to parent
    if (this._parent) {
      this._parent.removeChild(this);
    }

    // remove all child objects
    for (let child of this._children) {
      this.pearl.entities.destroy(child);
    }

    // remove reference to allow GC
    this._children = new Set();

    this._state = 'destroyed';
  }

  private coroutineManager = new CoroutineManager();

  runCoroutine(generator: Runnable): IterableIterator<undefined> {
    return this.coroutineManager.run(generator);
  }

  cancelCoroutine(coroutine: IterableIterator<undefined>) {
    this.coroutineManager.cancel(coroutine);
  }

  private _collider: Collider;

  get collider() {
    return this._collider;
  }

  registerCollider(collider: Collider) {
    if (this._collider) {
      throw new Error('this object already has a collider');
    }
    this._collider = collider;
  }
}
