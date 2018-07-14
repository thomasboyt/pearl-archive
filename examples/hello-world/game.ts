import { Component, createPearl, GameObject, Physical } from '../../src';

class HelloWorldText extends Component<null> {
  rotation = 0;

  update(dt: number) {
    this.rotation -= dt * (Math.PI / 180) * 0.05;
  }

  render(ctx: CanvasRenderingContext2D) {
    const center = this.getComponent(Physical).center;

    ctx.font = '16px Helvetica';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';

    ctx.translate(center.x, center.y);
    ctx.rotate(this.rotation);

    ctx.fillText('Hello world!', 0, 0);
  }
}

class Game extends Component<null> {
  init() {
    this.pearl.entities.add(
      new GameObject({
        name: 'hello world text',
        components: [
          new Physical({
            center: {
              x: 150,
              y: 150,
            },
          }),
          new HelloWorldText(),
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
