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
      this._loopFn(dt);
      this._requestId = requestAnimationFrame(tick);
    };

    this._requestId = requestAnimationFrame(tick);
  }

  stop() {
    if (this._requestId !== undefined) {
      cancelAnimationFrame(this._requestId);
    }
  }
}
