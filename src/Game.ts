import EntityManager from './EntityManager';
import Collider from './Collider';
import Inputter from './Inputter';
import Ticker from './Ticker';
import Renderer, {RendererOpts} from './Renderer';
import AsyncManager from './Async';

abstract class Game {
  entities: EntityManager;
  collider: Collider;
  inputter: Inputter;
  renderer: Renderer;
  ticker: Ticker;
  async: AsyncManager;

  constructor() {
    this.entities = new EntityManager(this);
    this.collider = new Collider(this);
    this.renderer = new Renderer(this);
    this.inputter = new Inputter();
    this.async = new AsyncManager();
  }

  init(): void {
  }

  update(dt: number): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {
  }

  run(opts: RendererOpts) {
    this.renderer.run(opts);

    this.inputter.bind(opts.canvas);

    this.ticker = new Ticker((dt: number) => {
      this.update(dt);
      this.async.update(dt);
      this.entities.update(dt);
      this.collider.update();
      this.renderer.update();
      this.inputter.update();
    });

    this.async.startAt(this.ticker.time);

    this.init();
  }
}

export default Game;