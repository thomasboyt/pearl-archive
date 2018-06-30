import * as uuidv4 from 'uuid/v4';

import Component from './Component';
import PearlInstance from './PearlInstance';

export interface CreateOpts {
  /**
   * The name of this GameObject, used to for displaying in debug tools.
   */
  name: string;

  /**
   * The components attached to this GameObject
   */
  components: Component<any>[];

  /**
   * The z-layer that this GameObject's components should render at. Defaults to 0, except for the
   * root GameObject, which defaults to -1.
   */
  zIndex?: number;

  /**
   * Tags attached to this GameObject (see hasTag())
   */
  tags?: string[];
}

export type GameObjectState = 'created' | 'initialized' | 'destroyed';

/**
 * A GameObject is an entity in the world that holds a collection of components.
 *
 * It is instantiated directly, but is not registered in the world until passed to
 * pearl.entities.add() or gameObject.addChild().
 */
export default class GameObject {
  pearl: PearlInstance;

  zIndex: number = 0;

  id = uuidv4();

  readonly name: string;
  private components: Component<any>[] = [];
  private tags: string[] = [];

  private _state: GameObjectState = 'created';
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

  private addComponent(component: Component<any>) {
    component.gameObject = this;
    this.components.push(component);
  }

  /**
   * Check whether this component has the specified tag.
   */
  hasTag(tag: string): boolean {
    // TODO: probably use a Set or Map for this
    return !!this.tags.find((val) => val === tag);
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

    // TODO: TypeScript doesn't know that c here is instanceof componentType, for some reason,
    // so we unfortunately have to hard-cast here
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

  // This is a re-implementation of Unity's sendMessage() kept around for posterity's sake, but
  // if you look up "unity sendMessage" like 8 the first 10 results are saying "don't use this trash
  // API," so I think I'm going to avoid ever uncommenting it.
  //
  // sendMessage(name: string, ...args: any[]) {
  //   for (let component of this.components) {
  //     if (typeof component[name] === 'function') {
  //       component[name](...args);
  //     }
  //   }
  // }

  /* Object tree system */

  private _parent: GameObject | null = null; // top-level game object doesn't have a parent
  private _children: Set<GameObject> = new Set();

  /**
   * This GameObject's child GameObjects.
   *
   * This Set should not be mutated (use `addChild` instead)!
   */
  get children(): Set<GameObject> {
    return this._children;
  }

  /**
   * This GameObject's parent GameObject, or null if it is a top-level object.
   */
  get parent(): GameObject | null {
    return this._parent;
  }

  private setParent(parent: GameObject) {
    this._parent = parent;
  }

  /**
   * Instantiates a passed GameObject and adds it as a child object to this GameObject.
   *
   * Returns the GameObject for convenience.
   */
  addChild(child: GameObject): GameObject {
    child.setParent(this);
    this._children.add(child);
    this.pearl.entities.add(child);
    return child;
  }

  private removeChild(child: GameObject) {
    this._children.delete(child);
  }

  /*
   * Internal hooks
   */

  create() {
    // game is set at this point
    for (let component of this.components) {
      component.create(component.initialSettings);
    }
  }

  update(dt: number) {
    if (this.state === 'created') {
      for (let component of this.components) {
        component.init(component.initialSettings);
      }

      this._state = 'initialized';
    }

    for (let component of this.components) {
      component.update(dt);
    }
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
}
