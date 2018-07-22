# Coroutines

If you have a stateful process that lasts across multiple frames - for example, a timed animation cycle, or an entity that waits a certain amount of time before performing an action - you may want to try using coroutines.

Coroutines in Pearl are based off ES6 generators. If you've used [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) syntax, you'll be right at home. A _coroutine_ is a generator function that yields a promise.

Here's an example of a component with a simple coroutine that changes a displayed message after 5 seconds:

```typescript
class TimedMessage extends Pearl.Component<null> {
  message: string = 'Waiting...';

  init() {
    this.runCoroutine(this.messageChanger);
  }

  *messageChanger() {
    yield this.pearl.async.waitMs(5000);
    this.message = 'Hello coroutines!';
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.message, 100, 100);
  }
}
```

Unlike traditional async/await methods or simple promise chaining, coroutine execution is tied into the game's run loop.

Coroutines started using `runCoroutine` inside a component are stopped when that component's Entity is destroyed. Internally, this works by simply discarding the coroutine. However, any asynchronous operations spawned by the coroutine will still finish, as JavaScript promises currently can't be canceled. Take the following example:

```typescript
import {getHttp} from 'some-http-library';

class LoadMessage extends Pearl.Component<null> {
  message: string = 'Loading...';

  init() {
    this.runCoroutine(this.getAsync);
    this.runCoroutine(this.cancelAsync);
  }

  *getAsync() {
    // assume this takes 100 ms to finish:
    const msg = yield getHttp('/message');
    this.message = msg;
  }

  *cancelAsync() {
    yield this.pearl.async.waitMs(50);
    this.pearl.entities.destroy(this.entity);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.message, 100, 100);
  }
}
```

Here, the Entity is destroyed before `getHttp` returns its response and sets the message. When this happens, the `getAsync` coroutine is discarded and never resumed. However, `getHttp()` _itself isn't canceled_ and will complete execution, with its result simply being discarded.

