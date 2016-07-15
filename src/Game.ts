import EntityManager from './EntityManager';
import Collider from './Collider';
import Inputter from './Inputter';
import Ticker from './Ticker';
import Renderer, {RendererOpts} from './Renderer';

abstract class Game {
  entities: EntityManager;
  collider: Collider;
  inputter: Inputter;
  renderer: Renderer;
  ticker: Ticker;

  constructor() {
    this.entities = new EntityManager(this);
    this.collider = new Collider(this);
    this.renderer = new Renderer(this);
    this.inputter = new Inputter();
  }

  abstract update?: (dt: number) => void;
  abstract draw?: (ctx: CanvasRenderingContext2D) => void;

  run(opts: RendererOpts) {
    this.renderer.run(opts);

    this.inputter.bind(opts.canvas);

    this.ticker = new Ticker((dt: number) => {
      if (this.update) {
        this.update(dt);
      }

      this.entities.update(dt);
      this.collider.update();
      this.renderer.update();
      this.inputter.update();
    });
  }
}

export default Game;