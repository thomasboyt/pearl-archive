import test from 'ava';

import Renderer from '../src/Renderer';
import PearlInstance from '../src/PearlInstance';

test.beforeEach(() => {
  (window as any).devicePixelRatio = 1;
});

function createPearl() {
  return new PearlInstance([]);
}

test('renderer scales the canvas for canvas displays', (t) => {
  (window as any).devicePixelRatio = 2;

  const canvas = document.createElement('canvas');

  // TODO: this is a lazy lil mock here, might be better ways to do this...
  let scaleX: number = 1, scaleY: number = 1;
  canvas.getContext('2d')!.scale = function(x, y) {
    scaleX = x;
    scaleY = y;
  };

  const renderer = new Renderer(createPearl());

  renderer.run({
    canvas,
    width: 400,
    height: 300,
  });

  const ctx = renderer.getCtx();

  t.is(scaleX, 2);
  t.is(scaleY, 2);

  t.is(ctx.canvas.width, 800);
  t.is(ctx.canvas.height, 600);

  t.is(ctx.canvas.style.width, '400px');
  t.is(ctx.canvas.style.height, '300px');
});
