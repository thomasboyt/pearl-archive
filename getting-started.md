# Getting Started

## Overview

Pearl is a framework built around the [Component pattern](http://gameprogrammingpatterns.com/component.html). Lots of big fancy game frameworks, like Unity and Unreal Engine, use this pattern, so you might find it familiar. If not, don't fret!

If you're familiar with OOP, you might best think of components as _really fancy mixins/traits_. In a component system, you have "entities" \(in our case, actual entities in the game world\), which are objects that only hold a few things:

* Metadata that makes it possible to identify what _kind_ of entity this is. In Pearl, this is a _name_ that gets set on an object, plus optional tags to further identify the entity. For example, if you were building a Pac-Man clone, you might create four ghost objects with their own name \(e.g. `Inky`, `Blinky`, `Pinky`, and `Clyde`\), but all sharing a `ghost` tag.
* A list of components that make up the entity. For a Pac-Man ghost, each ghost might have a `SpriteRenderer` to determine what to render and a `Physical` component determining its place in the game world. Since each ghost has different AI, you would then add different components to each ghost for their AI - e.g. `InkyAI`, `BlinkyAI` - that might all subclass a base `GhostAI` component.

Components can easily reference sibling components on the same component - for example, the `GhostAI` component could look up the `Physical` component to determine where it currently is, and make decisions based on the entity's current location.

## Hello World

To illustrate how you can use components, let's create a simple game,

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

Here, we've created a single `Component`, `HelloWorld`, which uses the `render` hook to render some text. A `Component` is a composable script that can be added to a `GameObject`. We'll get into `GameObject` creation in a second, but here, we add it as a _root component_ to the top-level `GameObject` that is implictly created when you create a new instance of `Pearl`.

In addition to `rootComponents`, `createPearl` takes the width and height of the canvas, and a canvas object to render into. The canvas needs to be defined before you run the script, which is simple enough:

```markup
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

