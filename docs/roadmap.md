# Roadmap

## Collision System

Pearl now has components for polygonal and circular collision, but currently, collision detection has to manually used from the `update()` hook:

```typescript
class PlatformerPhysics extends Component<Options> {
  update(dt: number) {
    this.testPlatformCollisions();
  }

  private testPlatformCollisions() {
    const blocks = [...this.world.children].filter((entity) => entity.hasTag(Tags.block));

    const phys = this.getComponent(Physical);

    for (let block of blocks) {
      const selfPoly = this.getComponent(PolygonCollider);
      const otherPoly = block.getComponent(PolygonCollider);

      const collision = selfPoly.getCollision(otherPoly);
      if (collision) {
        this.resolvePlatformCollision(collision);
      }
    }
  }
}
```

This works, but is far from ideal.

Some frameworks, from Coquette to Unity, offer some sort of collision hook at the entity/component level, and then use some process. Other frameworks, like Superpowers, have helpful methods you can call within the `update` hook.

Prior art:

* Unity
  * [https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionEnter2D.html](https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionEnter2D.html)
* Superpowers
  * [http://docs.superpowers-html5.com/en/tutorials/collision-2d](http://docs.superpowers-html5.com/en/tutorials/collision-2d)
* Godot
  * http://docs.godotengine.org/en/3.0/getting_started/step_by_step/your_first_game.html#preparing-for-collisions

### Kinematic Movement

e.g. http://docs.godotengine.org/en/3.0/tutorials/physics/using_kinematic_body_2d.html

The important idea here is that instead of relying on a collision system to fire events about collision, this just has the player move, and if a collision is detected, it immediately resolves the collision and returns a collision. It also has special-case movement stuff, similar to the [weird logic you need in a platformer](https://github.com/thomasboyt/blorp/blob/master/src/entities/PlatformerPhysicsEntity.js#L37)

### Other questions

* Could entities be grouped into a single top-level "scene" component?
  * Scene component would get all children and create collision pair tests between them
* Is it fine for collisions to exist as just another system in a component's update hook, or should it have special component hooks and exist in a special system?
  * Unity does the latter - why?
    * Superpowers _does not_, fwiw, and there may be others that don't.
  * Collisions generally need to be resolved _before_ updates happen \(see Coquette\)
    * Pre-update hook?
* Long-term considerations
  * Collision layers? Would help avoid triggering/calculating unnecessary collisions

## Simpler Entity Creation

Entity creation is currently a kind of awkward process, depending on what you want to do. Specifically:

- The _settings_ passed through to `create()` and `init()` create an awkward second set of preconfigured properties
- Overriding settings created by e.g. a factory or "prefab"-like construct requires the original component to have special logic:

```typescript
type Settings = {sprite?: Sprite};

class MyComponent<Settings> {
  sprite?: Sprite;

  init(settings: Settings) {
    // check to see if this has already had a sprite set on it
    if (settings.sprite && !this.sprite) {
      this.sprite = settings.sprite;
    }
  }
}
```

TypeScript (as of 2.1) now makes it easy to create a type-safe API similar to the original Coquette entity construction API:

```typescript
export class MagicSettingsComponent<T> extends Component<any> {
  constructor(settings: Partial<T> = {}) {
    super();
    for (let key of Object.keys(settings)) {
      this[key] = settings[key];
    }
  }
}

interface ISpriteRendererProperties {
  spritePath: string;
  scaleX: string;
}

class SpriteRenderer extends MagicSettingsComponent<ISpriteRendererProperties>
  implements ISpriteRenderer {
  spritePath?: string;

  create() {
    console.log(this.spritePath);
  }

  renderSprite() {
    // ...
  }
}

new SpriteRenderer({ spritePath: 'foo.png' });
```

This would make reasoning about setting and using properties before and during initialization much easier.

There are some potential downsides:

a) Settings that are only used during initialization, and then discarded, would still have to defined as properties on the component.

b) TypeScript's `keyof` includes methods/getters/setters, requiring an interface to be defined without these. This is annoying bit of boilerplate :(

c) The component wouldn't have type-safe _required_ settings:

```typescript
class MyComponent extends Component {
  a: string;

  create() {
    console.log(this.a.toUpperCase());
  }
}

// errors out because a is not passed
this.pearl.entities.add(new GameObject({
  components: [new MyComponent()],
});
```

However, this may not be a big deal, as "required" settings are in opposition to being able to update settings after construction anyways. Maybe some kind of helper could be added to throw out automagically if required settings are missing at `create()` (or `init()`) time?

d) Setters that depend on the parent object may error out with this.

An experimental implementation of this exists at the `ideas/magic-components` branch.

## Devtools Inspector

This is its infancy at [Pearl Inspect](https://github.com/thomasboyt/pearl-inspect).

The goal of the Pearl Inspector will be to add a simple display of entities in the world (shown in the parent-child hierarchy) and their components. For more information on the roadmap and status of this project, see [its TODO file](https://github.com/thomasboyt/pearl-inspect/blob/master/TODO.md).

## Canvas scaling utilities

It'd be great to offer canvas scaling utilities, like scaling-on-resize while maintaining the original aspect ratio \(using `ctx.scale`, that is, not CSS that causes blurry images\). It'd also be cool to have a full-screen toggle.

## Design Questions, etc.

This is an unsorted list of things I've been thinking about.

* How are objects created/destroyed?
  * Figure out better API for `entities.add`/`entities.destroy`
  * Maybe `this.createObject({...})` / `this.destroyObject({...})`
* Add better utilities for managing destroyed objects and components
  * Unity's able to automatically null references to destroyed objects. I don't think there's any magic I can do for that in TS/JS, unfortunately.
  * Make `destroyedObject.getComponent()` give an explicit error
* How are "game controller" level components handled?
  * Singleton example in Unity: [https://unity3d.com/learn/tutorials/projects/2d-roguelike-tutorial/writing-game-manager](https://unity3d.com/learn/tutorials/projects/2d-roguelike-tutorial/writing-game-manager)
  * Useful SA discussion on Unity singletons starts here: [http://forums.somethingawful.com/showthread.php?threadid=2692947&userid=0&perpage=40&pagenumber=444\#post462272736](http://forums.somethingawful.com/showthread.php?threadid=2692947&userid=0&perpage=40&pagenumber=444#post462272736)
  * Make `game` object a `GameObject`: `this.obj.game.getComponent(GameManager)`
* Figure out additional hooks for components
  * For example, collision needs to be broken up into "detection" and "resolution" phases, so that e.g. an enemy that turns around when it hits a block can be coded as two separate components
  * `FixedUpdate`-like hook? Does this even make sense in a single-threaded application? Seems suuuper difficult to time and schedule correctly.