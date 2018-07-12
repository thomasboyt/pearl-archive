import EntityManager from './EntityManager';
import Inputter from './Inputter';
import Ticker from './Ticker';
import Renderer, { RendererOpts } from './Renderer';
import AsyncManager from './Async';
import Runner from './Runner';

import Component from './Component';
import GameObject from './GameObject';

/**
 * The current *instance* of Pearl, which can be referenced by child components using `this.pearl`.
 *
 * This instance holds things that would often be singletons or globals in other frameworks,
 * including utilities for adding/removing entities from the world, input handling, and coroutine
 * scheduling.
 *
 * In addition, it also holds a reference to the top-level GameObject at `obj`, which can be used
 * to quickly access root-level components.
 */
export default class PearlInstance {
  entities: EntityManager;
  inputter: Inputter;
  renderer: Renderer;
  ticker: Ticker;
  runner: Runner;
  async: AsyncManager;

  /**
   * The top-level GameObject, which holds components defined in rootComponents.
   */
  obj: GameObject;

  /**
   * Factor by which to speed up or slow down the in-engine time. This affects the delta-time passed
   * to `update()` as well as the internal timer for `async.waitMs()`.
   */
  timeScale: number = 1;

  constructor() {
    this.entities = new EntityManager(this);
    this.renderer = new Renderer(this);
    this.inputter = new Inputter();
    this.runner = new Runner();
    this.async = new AsyncManager();
  }

  run(opts: CreatePearlOpts) {
    this.renderer.run(opts);

    this.inputter.bind(opts.canvas);

    this.ticker = new Ticker((realDt: number) => {
      const dt = realDt * this.timeScale;
      this.runner.update();
      this.async.update(dt);
      this.entities.update(dt);
      this.renderer.update();
      this.inputter.update();
    });

    this.async.startAt(this.ticker.time);

    this.obj = new GameObject({
      name: 'Game',
      components: opts.rootComponents,
      zIndex: -1,
    });

    this.entities.add(this.obj);
  }
}

export interface CreatePearlOpts {
  rootComponents: Component<any>[];
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  backgroundColor?: string;
}

/**
 * Create a Pearl instance with the passed root components and canvas configuration, initializing
 * your game.
 */
export function createPearl(opts: CreatePearlOpts): PearlInstance {
  const game = new PearlInstance();
  game.run(opts);
  (window as any).__pearl__ = game;
  return game;
}
