export default class Ticker {
  private _nextTickFn: () => void;
  private _loopFn: (dt: number) => void;

  time: number;

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
      requestAnimationFrame(this._nextTickFn);
    };

    this._nextTickFn = tick;
    window.requestAnimationFrame(this._nextTickFn);
  }

  stop() {
    this._nextTickFn = () => {};
  }
}