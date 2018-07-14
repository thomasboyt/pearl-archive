# Tutorial

In this tutorial, we'll make a very simple game, in which the heroic player, as represented by a box, shall pick up a sword to slay the terrifying, massive enemy, as represented by a somewhat larger box.

## Set up

**TODO**: This tutorial is currently missing details about setting up Webpack, TypeScript, etc. Looking at the `examples.config.js` webpack config in this repo may help somewhat with this. Eventually, the tutorial and example project will be moved out to a separate repo, with its own Webpack configuration.

## Creating the game world and player object

First off, let's just create a game world that contains the player:

```typescript
// game.ts

import {
  Component,
  createPearl,
  GameObject,
  Physical,
  PolygonCollider,
  PolygonRenderer,
} from 'pearl';

class Game extends Component<null> {
  init() {
    this.pearl.entities.add(
      new GameObject({
        name: 'player',
        components: [
          new Physical({
            center: {
              x: 140,
              y: 20,
            },
          }),

          PolygonCollider.createBox({
            width: 20,
            height: 20,
          }),

          new PolygonRenderer({
            fillStyle: 'cyan',
          }),
        ],
      })
    );
  }
}

createPearl({
  rootComponents: [new Game()],
  width: 300,
  height: 300,
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
});
```

Start by looking at the bottom  of the file: we're creating a new Pearl instance using `createPearl`. In addition to setting the canvas to use, and its width and height, we define a _root component_. This component is instantiated when the game starts, and is generally used as an "entry point" into the game. It's attached to a root entity, which can be accessed at `this.pearl.obj`.

When the game component is initialized, we create a new entity, the player. The player entity is composed of a `Physical` component, giving it a position, a `PolygonCollider` component, which creates a rectangular collider, and a `PolygonRenderer` component, which renders the polygon defined by the `PolygonCollider`.

Now, when we start the game, we see a cyan box at the top of the screen. Our valiant player will venture down to face an enemy at the bottom of the screen, which we will add in a moment. However, before we do so, we need to give the player the ability to move.

## Adding player input

To give the player the ability to move, we'll create a new component, `Player`, which will be attached to the entity along with the previously-shown components. In a new file, a new component is created:

```typescript
// components/Player.ts

import { Component } from 'pearl';

export default class Player extends Component<null> {
}
```

Then, back in our root Game component, we import the component and add it to the components:

```typescript
// snip previously shown imports...
import Player from './components/Player';

class Game extends Component<null> {
  init() {
    this.pearl.entities.add(
      new GameObject({
        name: 'player',
        components: [
          // snip previously shown components...
          new Player(),
        ]
      })
    );
  }
}
```

Now, we can add our input logic to `Player`.

To move the player, we need to do two things: read the input from the keyboard (that is, which arrow keys are being pressed), and then apply a velocity to the entity's `Physical` component:

```typescript
import { Component, Keys, Physical } from 'pearl';

export default class Player extends Component<null> {
  playerSpeed = 0.1;

  update(dt: number) {
    this.move(dt);
  }

  private move(dt: number) {
    let xVec = 0;
    let yVec = 0;

    if (this.pearl.inputter.isKeyDown(Keys.rightArrow)) {
      xVec = 1;
    } else if (this.pearl.inputter.isKeyDown(Keys.leftArrow)) {
      xVec = -1;
    }

    if (this.pearl.inputter.isKeyDown(Keys.downArrow)) {
      yVec = 1;
    } else if (this.pearl.inputter.isKeyDown(Keys.upArrow)) {
      yVec = -1;
    }

    this.getComponent(Physical).translate({
      x: xVec * this.playerSpeed * dt,
      y: yVec * this.playerSpeed * dt,
    });
  }
}
```

Here, we've defined a method, `move()`, which gets called on every frame through the `update()` hook. `move()` reads the currently-pressed keys via the `pearl.inputter` API, which is available in any component. The x and y velocities are just set to `0`, `1`, `-1` to indicate direction.

When we go to move the entity, we use the `Physical` component's `translate()` method, which moves the entity by a given x and y distance. To give the actual distance to move, the velocities are multiplied by `dt`, or delta-time. This is the amount of time, in ms, that have passed since the last frame. This is what allows objects to move smoothly over a variable framerate  -  e.g., whether your game runs at 30 frames a second or 60 frames a second, as long as you use delta-time as a factor in movement calculations, players will move the same distance over time. This is then multiplied by a `playerSpeed` factor that can be thought of as "pixels per millisecond." Our entity will move at `0.1` pixels per millisecond in the direction pushed, or `100` pixels a second.

If you reload the game, you'll see that you can move around the game world with the arrow keys. Great! Now we need something to defeat with our newfound mobility.

## Creating the enemy

We'll quickly throw in a big ol' enemy to fight. Underneath the player creation code in our `Game` component, we add another entity:

```typescript
class Game extends Component<null> {
  init() {
    // ... snip player creation code ...

    this.pearl.entities.add(
      new GameObject({
        name: 'enemy',
        tags: ['enemy'],

        components: [
          new Physical({
            center: {
              x: 140,
              y: 260,
            },
          }),

          PolygonCollider.createBox({
            width: 40,
            height: 40,
          }),

          new PolygonRenderer({
            fillStyle: 'red',
          }),
        ],
      })
    );
  }
}
```

This code should look familar, with only a few values changed from the player creation. One notable change is the addition of `tags` - these are strings that can be used to identify _types of entities_. In a traditional OOP game, you might use `instanceof` to determine what kind of object you're looking at - say, `entity instanceof Enemy` - but since here, all entities are merely instances of `GameObject`, we use `tags` to distinguish them. You'll see this in use in the next section.

If you refresh, you'll see a big red box at the bottom of the screen, our new enemy. Currently, we can run right up to it - or through it - and laugh at it, since it currently has no way to fight back. Let's make it so that if you run into the enemy without a weapon, the enemy will, as expected, kill you.

## Creating collision detection

While Pearl includes `PolygonCollider` and `CircleCollider` components, it doesn't automatically _do_ anything with them, unlike some fancier frameworks. This is partially so that you have control over handling and resolving collisions - since the way Pac-Man handles collisions is a heck of a lot different than how Mario would - but is also because I haven't come up with a good, magical collision API yet. It might get there eventually!

For now, we'll add collision detection inside the `Player` component. We need to check to see if the player has collided with the enemy, and if so, set the player to dead. Back in our player component, we add a new field to the player, and a new placeholder function for checking collisions:

```typescript
export default class Player extends Component<null> {
  playerSpeed = 0.1;
  isAlive = true;

  update(dt: number) {
    if (!this.isAlive) {
      return;
    }

    this.move(dt);
    this.checkCollisions();
  }

  private move(dt: number) { /* ... */ }

  private checkCollisions() {
    // TODO
  }
}
```

Now, we have a flag that determines whether the player is alive to dead. If they're dead, we'll early return from `update()` to prevent the player from moving, and to skip unnecessary collision detection.

Now, inside `checkCollisions()`, we just want to see if the player has collided with the enemy, and then set `isAlive` to false if they have:

```typescript
class Player extends Component<null> {
  /* ... */

  private checkCollisions() {
    const enemy = this.pearl.entities.all('enemy')[0];

    if (
      enemy
        .getComponent(PolygonCollider)
        .isColliding(this.getComponent(PolygonCollider))
    ) {
      this.isAlive = false;
    }
  }
}
```

A couple new APIs show up here. First off, we need to find the enemy entity. There are several ways for components to reference other entities, depending on your needs. For example, a component that is always associated with another entity could just have references set directly on the component. So here, we could have chosen to add `enemy` as a field on `Player`, and then set up the reference when creating our entities:

```typescript
class Game extends Component<null> {
  init() {
    const player = this.pearl.entities.add(new GameObject(/* ... */));
    const enemy = this.pearl.entities.add(new GameObject(/* ... */));
    player.enemy = enemy;
  }
}
```

However, what if we later wanted to add multiple enemies? Managing an array of enemies would be annoying, especially since we'd have to ensure the enemy is removed from the array when destroyed. In addition, if we later made it so enemies could spawn over time, or from other events in the game world, it might be annoying to look up the player every time.

In general, looking up entities from the game world is Fast Enough(tm) for most games. If you profile your game and find `entities.all()` becoming a bottleneck, you might want to add some level of caching - especially if you need to do some complex filtering beyond just looking at tags, such as "only get entities in a certain area of the world" - but using `entities.all()` is the easiest way to get started.

So, with entity lookup taken care of, we then use the `isColliding()` method of `PolygonCollider`, which can check against another `PolygonCollider`, to see if the entities are colliding. If they are, we just set the player to dead. Now, if you refresh the game, you should see the player rendered helplessly immobile after touching the enemy, presumedly because the enemy has eaten or stabbed or done something equally horrendous.

So now the player dies when they poke the evil enemy, and can no longer move or win the game. To emphasize this point, we'll add a _game over_ display.

## Creating a Game Over Display

A simple UI will serve as a good introduction to canvas rendering in Pearl. Unlike `PolygonRenderer`, Pearl currently doesn't have a drop-in component for displaying text content. That's okay, though, as it's very easy to add.

Any component can have a `render()` function on it. Traditionally, you'd probably make a new UI component that would probably live in a UI entity, or maybe be a sibling component of your main `Game` component. For simplicity's sake, we'll just add a `render()` method to our root `Game` component:

```typescript
class Game extends Component<null> {
  init() { /* ... */ }

  render(ctx: CanvasRenderingContext2D) {
  }
}
```

Canvas rendering is outside of the scope of this tutorial, but it's a simple, if maybe overly-naive, API to work with. In Pearl, you can think of rendering as somewhat _stateless_ - between every frame, the canvas is completely thrown away, and every component's render function is redrawn.

Now, canvas operations can be kind of expensive to do 60 times a second, but there are methods for caching/memoizing canvas rendering built into Pearl. For now, we'll just do the naive thing of rendering text on every frame.

To determine whether to render our game over text, we need to check to see if the player's still alive. To do so, we'll store the player entity as a reference on the class, and check it every frame.

```typescript
class Game extends Component<null> {
  playerObj: GameObject;

  init() {
    this.playerObj = this.pearl.entities.add(new GameObject(/* ... */));

    /* ... */
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.playerObj.getComponent(Player).isAlive) {
      ctx.textAlign = 'center';
      ctx.font = '16px monospace';
      ctx.fillStyle = 'black';
      ctx.fillText('game over :(', 150, 150);
    }
  }
}
```

Now, if you run the game, you should see a nice game over message appear when you touch the enemy. Now the fun part: let's let the player win!

## Creating a Sword

We've seen how to render polygons using `PolygonRenderer`, and text using canvas drawing instructions. Now, for our sword, let's add a proper sword sprite, drawn by `SpriteRenderer`. The `SpriteRenderer` component simply renders a single sprite, while the `AnimationManager` can be used to add timed animations and multiple animation states to a component.

**TODO:** Pearl should have an actual first class asset loader. For now, you'll need to figure out your own strategy for loading images. Pearl wants sprite (or sprite sheets) to be loaded as `Image()` objects:

```typescript
import {Sprite} from 'pearl';

const swordImage = new Image();
swordImage.src = require('./sprites/sword.png');
```

Images *need to be loaded when the sprites are constructed.* Eventually I want to provide some generic tools for this (`AssetManager` was an attempt at one, but I don't like its API now, and don't think an asset manager should actually be tied into the Component system). For now, I recommend a preloading strategy:

```typescript
swordImage.onload = () => {
  createPearl({
    rootComponents: [new Game()],
    width: 300,
    height: 300,
    canvas: document.getElementById('canvas') as HTMLCanvasElement,
  });
};
```

Images can be used to construct either `Sprite` or `SpriteSheet` objects. `AnimationManager` can use the latter, but `SpriteRenderer` needs the former.

So, with your sprite image loaded, we can create a `Sprite` from it and use it in an entity:

```typescript
class Game extends Component<null> {
  init() {
    /* ... */

    const swordSprite = new Sprite(
      // sprite image
      swordImage,
      // offset x
      0,
      // offset y
      0,
      // sprite width
      swordImage.width,
      // sprite height
      swordImage.height
    );

    this.pearl.entities.add(
      new GameObject({
        name: 'sword',
        tags: ['sword'],
        components: [
          new Physical({
            center: {
              x: 150,
              y: 150,
            },
          }),

          PolygonCollider.createBox({
            width: swordSprite.width,
            height: swordSprite.height,
          }),

          new SpriteRenderer({
            sprite: swordSprite,
          }),
        ],
      })
    );
  }
}
```
Now, if you refresh the game, you'll see our nice, definitely not stolen from a famous Nintendo game sword sprite, waiting to be picked up. Back in `Player`, we can add logic to check collision with the sword, and set a flag to indicate we picked it up:

```typescript
export default class Player extends Component<null> {
  /* ... */

  hasSword = false;

  private checkCollisions() {
    /* ... */

    if (!this.hasSword) {
      const sword = this.pearl.entities.all('sword')[0];

      if (
        sword
          .getComponent(PolygonCollider)
          .isColliding(this.getComponent(PolygonCollider))
      ) {
        this.hasSword = true;
      }
    }
  }
}
```

Great, except the sword's still left behind in the ground!

In a real game, the `sword` entity would likely have just represented a sword _pickup_, and once you've collected it, the entity would be removed from the world. However, since this is a tutorial and not a real game, this is a good time to show off one last feature of Pearl. We want to render the player _holding_ the sword, that is, the sword sprite moving along with the player. So let's add the sword as a _child entity_ of the player, and then set its position relative to the player's position:

```typescript
export default class Player extends Component<null> {
  /* ... */

  private checkCollisions() {
    /* ... */

    if (!this.hasSword) {
      const sword = this.pearl.entities.all('sword')[0];

      if (
        sword
          .getComponent(PolygonCollider)
          .isColliding(this.getComponent(PolygonCollider))
      ) {
        this.hasSword = true;

        this.gameObject.appendChild(sword);
        sword.getComponent(Physical).localCenter = {
          x: -5,
          y: 15,
        };
      }
    }
  }
}
```

Now, when we pick up the sword, we'll see it move along with us!

**TODO**: Eventually, I'd like child objects to render with their _angle_ relative to their parent's, not just their _position_. Once this is done, this would be a good time show off the sword also _rotating_ when the player turns (though I'd also have to add some logic to set the player's angle... maybe this should all be done once player is also rendered by a sprite).

## Slaying the Enemy

There are only two pieces remaining now. When the player collides with the enemy, the enemy should be killed - that is, removed from the game world:

```typescript
export default class Player extends Component<null> {
  /* ... */

  private checkCollisions() {
    const enemy = this.pearl.entities.all('enemy')[0];

    if (
      // Note that sense the enemy can now be destroyed, we've added a check to
      // make sure it's present before checking collision against it, or else
      // it would error out!
      enemy &&
      enemy
        .getComponent(PolygonCollider)
        .isColliding(this.getComponent(PolygonCollider))
    ) {
      if (this.hasSword) {
        this.pearl.entities.destroy(enemy);
      } else {
        this.isAlive = false;
      }
    }

    /* ... */
  }
}
```

And the UI should be updated to show a nice "you win!" message:

```typescript
class Game extends Component<null> {
  init() {
    /* ... */

  render(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'center';
    ctx.font = '16px monospace';
    ctx.fillStyle = 'black';

    if (!this.playerObj.getComponent(Player).isAlive) {
      ctx.fillText('game over :(', 150, 150);
    }

    if (this.pearl.entities.all('enemy').length === 0) {
      ctx.fillText('you win!', 150, 150);
    }
  }
}
```

All done!

Exercises for the reader:

* Can you make it so that the _sword_, not the player, has to collide with the enemy to defeat it? This should require creating a new component for either the sword or the enemy.
* Experiment with adding sprites for the player and enemy.