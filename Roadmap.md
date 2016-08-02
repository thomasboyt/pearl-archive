# Roadmap

## New Features

### Devtools Inspector

Should be easy enough to configure [Coquette Inspect](https://github.com/thomasboyt/coquette-inspect) to work with Pearl.

### Pause system

A simple, built-in way to pause games would be great.

The pause system should, ideally, use a "time scale" concept [like Unity](https://docs.unity3d.com/ScriptReference/Time-timeScale.html), rather than interrupting the run loop. This way, `update()` hooks will still fire (with a `dt` of `0`), and coroutines that *don't* depend on `waitMs()` will continue.

Here's a relevant Unity discussion about some of the effects that pausing can have on a game and various workarounds for them: http://answers.unity3d.com/questions/7544/how-do-i-pause-my-game.html

### Canvas scaling utilities

~~The canvas should be scaled for retina screens out of the box.~~ It'd be great to offer other scaling utilities, like scaling-on-resize while maintaining the original aspect ratio (using `ctx.scale`, that is, not CSS that causes blurry images). It'd also be cool to have a full-screen toggle.

## API Improvements

* Colliders
  * Add API to get collision information
    * https://github.com/jriecken/sat-js#satresponse

## Design Questions

* [ ] How are objects created/destroyed?
  * Figure out better API for `entities.add`/`entities.destroy`
  * Maybe `this.createObject({...})` / `this.destroyObject({...})`
  * Add destroy hooks to components
  * This totally fucks with some of the object-lookup stuff... this system really should make sure you avoid manually managing object references, so that you can never reference a destroyed object...
    * http://answers.unity3d.com/questions/10032/does-unity-null-all-references-to-a-gameobject-aft.html
* [ ] What is a component responsible for? Standardize and document.
  * [x] Should components be able to *render*? Currently rendering is a separate function defined on the GameObject.
  * https://docs.unity3d.com/Manual/class-SpriteRenderer.html
* [ ] How are "game controller" level components handled?
  * Singleton example in Unity: https://unity3d.com/learn/tutorials/projects/2d-roguelike-tutorial/writing-game-manager
  * Useful SA discussion on Unity singletons starts here: http://forums.somethingawful.com/showthread.php?threadid=2692947&userid=0&perpage=40&pagenumber=444#post462272736
  * Make `game` object a `GameObject`: `this.obj.game.getComponent(GameManager)`
* [ ] How should we look up objects?
  * Unity: http://docs.unity3d.com/Manual/ControllingGameObjectsComponents.html
  * Linking directly with setters, like `enemy.setPlayer(player)`
  * By name: http://docs.unity3d.com/ScriptReference/GameObject.Find.html
  * By tag: http://docs.unity3d.com/ScriptReference/GameObject.FindGameObjectsWithTag.html
  * Unity has the concept of a "component tree" that's based around the `Transform` component, so you can e.g. look up "child objects"
  * **Currently**: Objects are passed through as arguments, which works as long as you're very careful about not leaving around extra references to destroyed objects! Probably should just codify this as a tree...
    * [ ] Bullets don't get destroyed when player is destroyed...
    * [ ] WorldManager has to manually manage player/platform/enemy references
    * [ ] GameManager has to manage title, world, gameOver references
* [ ] Begin figuring out what dev tooling around components looks like: how are components visualized?
* [ ] Currently, there are order-dependent update chains. Is this okay? Should this be codified?
  * For example: `PlayerController` has to be applied *before* `PlatformerPhysics`, or things feel really laggy since they're not applied for a whole frame.
* [ ] Figure out additional hooks for components
  * For example, collision needs to be broken up into "detection" and "resolution" phases, so that e.g. an enemy that turns around when it hits a block can be coded as two separate components
  * `FixedUpdate`-like hook? Does this even make sense in a single-threaded application? Seems suuuper difficult to time and schedule correctly.
* [ ] Should a collision hook be introduced using the new Collider components?
* [x] How should we look up components?
  * Components part of the current object: `self.getComponent(Type)`
* [x] Should probably deprecate `constructor()` hooks on components in favor of doing all initialization in `init()`. That way constructing a component is "pure" in that it never kicks off any process.
  * [x] Will need to make it possible to pass arguments to `init` somehow - maybe store any args passed to constructor, and pass them to init when called? Imagine this is super hard to type-check tho.