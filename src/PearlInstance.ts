import EntityManager from './EntityManager';
import Collider from './Collider';
import Inputter from './Inputter';
import Ticker from './Ticker';
import Renderer, {RendererOpts} from './Renderer';
import AsyncManager from './Async';
import Runner from './Runner';

import Component from './Component';
import GameObject from './GameObject';

export default class PearlInstance {
  entities: EntityManager;
  collider: Collider;
  inputter: Inputter;
  renderer: Renderer;
  ticker: Ticker;
  runner: Runner;
  async: AsyncManager;

  obj: GameObject;
  private rootComponents: Component<any>[]

  constructor(rootComponents: Component<any>[]) {
    this.rootComponents = rootComponents;

    this.entities = new EntityManager(this);
    this.collider = new Collider(this);
    this.renderer = new Renderer(this);
    this.inputter = new Inputter();
    this.runner = new Runner();
    this.async = new AsyncManager();

    (window as any).__pearl__ = this;
  }

  init() {
    this.obj = new GameObject({
      name: 'Game',
      components: this.rootComponents,
      zIndex: -1,
    });

    this.entities.add(this.obj);
  }

  run(opts: RendererOpts) {
    this.renderer.run(opts);

    this.inputter.bind(opts.canvas);

    this.ticker = new Ticker((dt: number) => {
      this.runner.update();
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

export interface CreatePearlOpts {
  rootComponents: Component<any>[],
  canvas: HTMLCanvasElement,
  width: number;
  height: number;
  backgroundColor?: string;
}

export function createPearl(opts: CreatePearlOpts) {
  const game = new PearlInstance(opts.rootComponents);

  return game.run(opts);
}