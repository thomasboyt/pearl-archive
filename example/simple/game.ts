import * as Pearl from '../../src';

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
    ctx.fillRect(this.center!.x - this.size!.x / 2,
                 this.center!.y - this.size!.y / 2,
                 this.size!.x,
                 this.size!.y);
  }
}

class Player extends Person {
  update(dt: number) {
    if (this.game!.inputter.isKeyDown(Pearl.Keys.upArrow)) {
      console.log('key is down!!!');
      this.center!.y -= (4 / 100) * dt;
    }
  }

  collision(other: Pearl.Entity) {
    if (other instanceof Person) {
      other.center!.y = this.center!.y;  // follow the player
    }
  }
}

class Game extends Pearl.Game {
  constructor() {
    super();

    const paramour = new Person({
      center: {
        x: 250,
        y: 40,
      },
      color: '#099',
    });

    const player = new Player({
      center: {
        x: 256,
        y: 110,
      },
      color: '#f07',
    });

    this.entities.add(paramour);
    this.entities.add(player);
  }
}

const game = new Game();

game.run({
  canvas: document.getElementById('game') as HTMLCanvasElement,
  width: 500,
  height: 150,
  backgroundColor: '#000',
});