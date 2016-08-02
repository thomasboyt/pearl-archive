# Pearl

Pearl is a small framework for creating video games in the browser. It's written in TypeScript, but can be used in any language that compiles to JavaScript.

Pearl aims to be a a simpler, code-only alternative to full-scale frameworks like [Unity](http://unity3d.com/) or [Superpowers](http://superpowers-html5.com/). Like those frameworks, Pearl uses the [Component](http://gameprogrammingpatterns.com/component.html) pattern to avoid complex object hierarchies and difficult-to-decompose entities. Unlike those frameworks, Pearl is a *code-only framework*, and does not include any editor or special tooling.

**Pearl is in very early alpha stages,** and will probably undergo many significant breaking changes before the first `0.1.0` release. There are many unanswered questions in the current design.

## View Examples

Run:

```
npm install
npm run run-examples
```

and open `localhost:8080` in your browser.

## Getting Started

Let's create a simple "hello world" app to get started.

```typescript
import {Component, createPearl} from 'pearl';

class HelloWorld extends Component<null> {
  render(ctx: CanvasRenderingContext2D) {
    ctx.font = '16px Helvetica';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';

    ctx.fillText('Hello world!', 150, 150);
  }
}

createPearl({
  rootComponents: [
    new HelloWorld(),
  ],
  width: 300,
  height: 300,
  canvas: document.getElementById('game') as HTMLCanvasElement,
});
```

### Coroutines

If you have a stateful process that lasts across multiple frames - for example, a timed animation cycle, or an entity that waits a certain amount of time before performing an action - you may want to try using coroutines.

Coroutines in Pearl are based off ES6 generators. If you've used [co](https://github.com/tj/co), or the ES7 [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) syntax, you'll be right at home. A *coroutine* is a generator function that yields either Promises or another coroutine.

Here's an example of an entity with a simple coroutine that changes a displayed message after 5 seconds:

```typescript
interface Opts {}

class TimedMessage extends Pearl.Entity<Opts> {
  message: string = "Waiting...";

  init() {
    this.game.async.schedule(this.messageChanger);
  }

  *messageChanger() {
    yield this.game.async.waitMs(5000);
    this.message = 'Hello coroutines!';
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.message, 100, 100);
  }
}
```

It's worth pointing out that unlike a regular `setTimeout()` call, `waitMs()` uses the game's run loop, so that code will not be executed when the game is paused (or, at least, it won't be once the pause system is implemented - see the roadmap below).

Another example usage of coroutines (adapted from [Unity's docs](https://docs.unity3d.com/Manual/Coroutines.html)) can be found in `examples/coroutines/`.

## Design Principles

## API

## Todo

- [ ] Improve coroutine API:
  - https://twitter.com/machty/status/756266064049233920
  - https://twitter.com/drosenwasser/status/756359260380856320
- [ ] Fix Entity/Collidable mismatch (think this will involve making Collidable fields nullable and adding `!` unwraps in a bunch of those functions?)
- [ ] Fix `entities.add()` type check (maybe completely overhaul entity creation, idk...)
- [ ] Port Coquette tests
- [ ] Autofocus
- [ ] Figure out how to include Coquette's license in this repo, I guess? Since it is a big ol' copy paste at the moment
- [ ] Figure out how to ship a built JavaScript version alongside the TypeScript source (two different packages? look at @staltz's libraries, e.g. https://github.com/staltz/xstream)
- [x] Add retina scaling to canvas
- [x] Fix abstract class usage
- [x] New tests!
- [x] Investigate coroutine scheduling (e.g. http://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html?from=Coroutine)

## Roadmap

### Devtools Inspector

Should be easy enough to configure [Coquette Inspect](https://github.com/thomasboyt/coquette-inspect) to work with Pearl.

### Pause system

A simple, built-in way to pause games would be great.

The pause system should, ideally, use a "time scale" concept [like Unity](https://docs.unity3d.com/ScriptReference/Time-timeScale.html), rather than interrupting the run loop. This way, `update()` hooks will still fire (with a `dt` of `0`), and coroutines that *don't* depend on `waitMs()` will continue.

Here's a relevant Unity discussion about some of the effects that pausing can have on a game and various workarounds for them: http://answers.unity3d.com/questions/7544/how-do-i-pause-my-game.html

### Canvas scaling utilities

~~The canvas should be scaled for retina screens out of the box.~~ It'd be great to offer other scaling utilities, like scaling-on-resize while maintaining the original aspect ratio (using `ctx.scale`, that is, not CSS that causes blurry images). It'd also be cool to have a full-screen toggle.

### Asset loading

Having an out-of-the-box asset loading solution would be great. This should be relatively easy to make a small component you can opt-out of. It should include a default UI for displaying a loading bar.

### Audio management

Goes with the above. A tiny, extendable Web Audio-based component would be great.

### Maybes

* State machine API
* Spritesheets
* Simple frame-based animation system
* Higher-level drawing APIs
