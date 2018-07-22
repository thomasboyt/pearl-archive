import EntityManager from './EntityManager';
import Inputter from './Inputter';
import Ticker from './Ticker';
import Renderer, { RendererOpts } from './Renderer';
import AsyncManager from './Async';
import Runner from './Runner';
import AssetManager, { AssetMap } from './AssetManager';
import AudioManager from './AudioManager';

import Component from './Component';
import Entity from './Entity';

/**
 * The current *instance* of Pearl, which can be referenced by child components
 * using `this.pearl`.
 *
 * This instance holds things that would often be singletons or globals in other
 * frameworks, including utilities for adding/removing entities from the world,
 * input handling, and coroutine scheduling.
 *
 * In addition, it also holds a reference to the top-level Entity  `root`, which
 * can be used to quickly access root-level components.
 */
export default class PearlInstance {
  entities: EntityManager;
  inputter: Inputter;
  renderer: Renderer;
  ticker: Ticker;
  runner: Runner;
  async: AsyncManager;
  audio: AudioManager;
  assets: AssetManager;

  /**
   * The top-level Entity which holds components defined in rootComponents.
   */
  root: Entity;

  /**
   * @deprecated
   */
  get obj() {
    return this.root;
  }

  /**
   * Factor by which to speed up or slow down the in-engine time. This affects
   * the delta-time passed to `update()` as well as the internal timer for
   * `async.waitMs()`.
   */
  timeScale: number = 1;

  constructor() {
    this.entities = new EntityManager(this);
    this.renderer = new Renderer(this);
    this.inputter = new Inputter();
    this.runner = new Runner();
    this.async = new AsyncManager();

    // XXX: AssetManager depends on audio having been instantiated, so it can
    // get the audioCtx
    this.audio = new AudioManager(this, { defaultGain: 0.5 });
    this.assets = new AssetManager(this);
  }

  async loadAssets(assets: AssetMap) {
    this.assets.setAssets(assets);
    await this.assets.load();
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

    this.root = new Entity({
      name: 'Game',
      components: opts.rootComponents,
      zIndex: -1,
    });

    this.entities.add(this.root);
  }
}

export interface CreatePearlOpts {
  rootComponents: Component<any>[];
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  backgroundColor?: string;
  assets?: AssetMap;
}

/**
 * Create a Pearl instance with the passed root components and canvas
 * configuration, initializing your game.
 */
export async function createPearl(
  opts: CreatePearlOpts
): Promise<PearlInstance> {
  const game = new PearlInstance();
  await game.loadAssets(opts.assets || {});
  game.run(opts);
  (window as any).__pearl__ = game;
  return game;
}
