# Getting Started

## Hello World

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

Here, we've created a single `Component`, `HelloWorld`, which uses the `render` hook to render some text. A `Component` is a composable script that can be added to a `GameObject`. We'll get into `GameObject` creation in a second, but here, we add it as a *root component* to the top-level `GameObject` that is implictly created when you create a new instance of `Pearl`.

In addition to `rootComponents`, `createPearl` takes the width and height of the canvas, and a canvas object to render into. The canvas needs to be defined before you run the script, which is simple enough:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <canvas id="canvas">
    </canvas>

    <script src="/helloWorld.bundle.js"></script>
  </body>
</html>
```
