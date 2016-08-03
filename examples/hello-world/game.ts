import {Component, createPearl} from '../../src';

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
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
});