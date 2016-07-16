// This demo is an adaptation of an example in the Unity docs:
// https://docs.unity3d.com/Manual/Coroutines.html

import * as Pearl from '../../src';

interface TextOpts {
  center: Pearl.Coordinates;
  text: string;
}

class FadingText extends Pearl.Entity<TextOpts> {
  text: string;

  opacity: number = 1;

  init(opts: TextOpts) {
    this.center = opts.center;
    this.text = opts.text
    this.game!.async.schedule(this.animateFade.bind(this));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fillText(this.text, this.center!.x, this.center!.y);
  }

  /**
   * Fade out text, 200 ms at a time
   */
  *animateFade() {
    while (true) {
      yield this.animateFadeOut();
      yield this.animateFadeIn();
    }
  }

  *animateFadeOut() {
    for (let opacity = 1; opacity >= 0; opacity -= 0.1) {
      this.opacity = opacity;
      yield this.game!.async.waitMs(500);
    }
  }

  *animateFadeIn() {
    for (let opacity = 0; opacity <= 1; opacity += 0.1) {
      this.opacity = opacity;
      yield this.game!.async.waitMs(500);
    }
  }
}

class Game extends Pearl.Game {
  init() {
    this.entities.add(new FadingText(), {
      text: 'Hello Coroutines!',
      center: {
        x: 250,
        y: 65,
      },
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