# Pearl

Pearl is a small framework for creating video games in the browser. It's written in TypeScript, but can be used in any language that compiles to JavaScript.

Pearl is inspired by and uses some code from [Coquette](http://coquette.maryrosecook.com/). Unlike Coquette, Pearl is built with TypeScript and ES6 classes in mind.

## Usage

```typescript
import Pearl from 'pearl';

interface PersonOptions {
  center: Pearl.Coordinates;
  color: string;
}

class Person extends Pearl.Entity {
  color: string;

  constructor(opts: PersonOptions) {
    super();
    this.color = opts.color;
    this.center = opts.center;
    this.size = {x: 9, y: 9};
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }
}

class Player extends Person {
  update(dt: number) {
    if (this.game.inputter.isDown(Pearl.keys.UpArrow)) {
      this.center.y -= 0.4 * dt;
    }
  }

  collision(other: Pearl.Entity) {
    if (other instanceof Person) {
      other.center.y = this.center.y;  // follow the player
    }
  }
}

class Game extends Pearl.Game {
  constructor() {
    const paramour = new Person(game, {
      center: {
        x: 250,
        y: 40,
      },
      color: '#099',
    });

    const player = new Player(game, {
      center: {
        x: 250,
        y: 40,
      },
      color: '#099',
    });

    this.entities.add(paramour);
    this.entities.add(player);
  }
}

const game = new Game();

game.run({
  canvas: document.getElementById('canvas'),
  width: 500,
  height: 150,
  backgroundColor: '#000',
});
```

## Design Principles

## API