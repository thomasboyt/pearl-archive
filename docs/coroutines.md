# Coroutines

If you have a stateful process that lasts across multiple frames - for example, a timed animation cycle, or an entity that waits a certain amount of time before performing an action - you may want to try using coroutines.

Coroutines in Pearl are based off ES6 generators. If you've used [co](https://github.com/tj/co), or the ES7 [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) syntax, you'll be right at home. A *coroutine* is a generator function that yields either Promises or another coroutine.

Here's an example of a component with a simple coroutine that changes a displayed message after 5 seconds:

```typescript
class TimedMessage extends Pearl.Component<null> {
  message: string = 'Waiting...';

  init() {
    this.game.async.schedule(this.messageChanger.bind(this));
  }

  *messageChanger() {
    yield this.game.async.waitMs(5000);
    this.message = 'Hello coroutines!';
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.message, 100, 100);
  }
}
```

It's worth pointing out that unlike a regular `setTimeout()` call, `waitMs()` uses the game's run loop, so that code will not be executed when the game is paused (or, at least, it won't be once the pause system is implemented - see the roadmap below).

Another example usage of coroutines (adapted from [Unity's docs](https://docs.unity3d.com/Manual/Coroutines.html)) can be found in `examples/coroutines/`.
