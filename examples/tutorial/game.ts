import {
  Component,
  createPearl,
  GameObject,
  Physical,
  PolygonCollider,
  PolygonRenderer,
  Sprite,
  SpriteRenderer,
} from '../../src';

import Player from './components/Player';

const swordImage = new Image();
swordImage.src = require('./sprites/sword.png');

class Game extends Component<null> {
  playerObj: GameObject;

  init() {
    const swordSprite = new Sprite(
      swordImage,
      0,
      0,
      swordImage.width,
      swordImage.height
    );

    this.playerObj = this.pearl.entities.add(
      new GameObject({
        name: 'player',
        components: [
          new Physical({
            center: {
              x: 150,
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

          new Player(),
        ],
      })
    );

    this.pearl.entities.add(
      new GameObject({
        name: 'enemy',
        tags: ['enemy'],

        components: [
          new Physical({
            center: {
              x: 150,
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

swordImage.onload = () => {
  createPearl({
    rootComponents: [new Game()],
    width: 300,
    height: 300,
    canvas: document.getElementById('canvas') as HTMLCanvasElement,
  });
};
