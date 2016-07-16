import * as Pearl from '../../src';

interface PersonOptions {
  center: Pearl.Coordinates;
  color: string;
}

class Person extends Pearl.Entity<PersonOptions> {
  color: string;

  init(opts: PersonOptions) {
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
      this.center!.y -= (4 / 100) * dt;
    }
  }

  collision(other: Pearl.Entity<any>) {
    if (other instanceof Person) {
      other.center!.y = this.center!.y;  // follow the player
    }
  }
}

class Game extends Pearl.Game {
  constructor() {
    super();

    this.entities.add(new Person(), {
      center: {
        x: 250,
        y: 40,
      },
      color: '#099',
    });

    this.entities.add(new Player(), {
      center: {
        x: 256,
        y: 110,
      },
      color: '#f07',
    });
  }
}

const game = new Game();

game.run({
  canvas: document.getElementById('game') as HTMLCanvasElement,
  width: 500,
  height: 150,
  backgroundColor: '#000',
});