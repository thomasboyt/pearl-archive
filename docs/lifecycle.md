# Entity & Component Lifecycle

## Component Hooks Recap

To remind, the basic lifecycle hooks on every component are:

```typescript
class MyComponent extends Component<null> {
  create() {
    // called immediately when the entity is added to the game world
  }

  init() {
    // called before the first update() tick, which is the frame _after_
    // the entity is added to the game world
  }

  update(dt: number) {
    // called on each frame
  }

  onDestroy() {
    // called immediately when the entity is removed from the game world
  }
}
```

The distinction between `create` and `init` specifically can be confusing, so it may be helpful to understand how the entity lifecycle works.

## Lifecycle Overview

Creating an entity constructs instances of your components, but does nothing else:

```typescript
const obj = new GameObject(components: [new MyComponent()])
```

At this point, no hooks on components are called, and the object hasn't been added to the game world.

When an entity is added:

```typescript
this.pearl.entities.add(obj);
```

The entity is moved to the `created` state, and the `create()` hook on components is called. The create hook _can_ access sibling components at this point, but it depends on the order they were added in the components array.

In general, you should defer anything that depends on other components or entities to the `init()` hook.

When an object is added, it is _initialized on the next frame_. This may change, but currently, it's done to make it easier to reason about adding entities. On the next frame, before any component's `update()` hook is called, all added entities are initialized, meaning their `init()` is called and all components are set up.

One nice guarantee from this is that if you add two entities on the same frame, you can safely reference one from the other in the first `update()` tick. Of course, the flip side of this is that it's not necessarily so safe to reference each other in `init()`.

## Impact of Lifecycles on Component Access

In general:

* Inside a component's `create()`, you should not reference sibling components or components on other entities created in the same frame, as they may not have been created yet.
* Inside a component's `init()`, you should not expect sibling components, or components on other entities created in the same frame, to have had their `init()` methods run yet.

Of course, there are potential workarounds for this behavior. For example, you could defer initialization of some dependent property on a component until its first `update()`:

```typescript
class AComponent extends Component<null> {
  importantString: string;

  init() {
    this.importantString = 'important';
  }
}

class BComponent extends Component<null> {
  importantStringCopy: string;
  initialized = false;

  init() {
    // THIS MAY NOT WORK if BComponent is initialized first!
    this.importantStringCopy = this.getComponent(AComponent).importantString;
  }

  update() {
    if (!this.initialized) {
      // at this point, BComponent is guaranteed to have been initialized
      this.importantStringCopy = this.getComponent(AComponent).importantString;
      this.initialized = true;
    }
  }
}
```

This should _only_ be done as a last resort - obviously, in this case, there would be several other ways to handle this, such as setting the string in `create()`, or simply not copying the string and instead accessing it through `AComponent` every time.

