import Renderer from '../Renderer';
import PearlInstance from '../PearlInstance';

jest.mock('../AudioManager');

beforeEach(() => {
  (window as any).devicePixelRatio = 1;
});

function createPearl() {
  return new PearlInstance();
}

describe('renderer', () => {
  test('renderer scales the canvas for canvas displays', () => {
    (window as any).devicePixelRatio = 2;

    const canvas = document.createElement('canvas');

    // TODO: this is a lazy lil mock here, might be better ways to do this...
    let scaleX: number = 1;
    let scaleY: number = 1;
    canvas.getContext('2d')!.scale = function(x, y) {
      scaleX = x;
      scaleY = y;
    };

    const pearl = new PearlInstance();

    pearl.renderer.run({
      canvas,
      width: 400,
      height: 300,
    });

    pearl.renderer.update();

    const ctx = pearl.renderer.getCtx();

    expect(scaleX).toBe(2);
    expect(scaleY).toBe(2);

    expect(ctx.canvas.width).toBe(800);
    expect(ctx.canvas.height).toBe(600);

    expect(ctx.canvas.style.width).toBe('400px');
    expect(ctx.canvas.style.height).toBe('300px');
  });
});
