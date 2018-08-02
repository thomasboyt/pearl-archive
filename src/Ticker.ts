export default class Ticker {
  time: number;

  private _requestId?: number;
  private _loopFn: (dt: number) => void;

  constructor(gameLoop: (dt: number) => void) {
    this._loopFn = gameLoop;
    this.start();
  }

  start() {
    this.time = Date.now();

    const tick = () => {
      const now = Date.now();
      const dt = now - this.time;
      this.time = now;
      this.step(dt);
      this._requestId = requestAnimationFrame(tick);
    };

    this._requestId = requestAnimationFrame(tick);
  }

  stop() {
    if (this._requestId !== undefined) {
      cancelAnimationFrame(this._requestId);
    }
  }

  /**
   * Step forward the game loop one tick with a certain delta time. This is
   * public because tests and dev tooling both use this to step arbitrary
   * amounts of time.
   */
  step(dt: number) {
    this._loopFn(dt);
  }
}
