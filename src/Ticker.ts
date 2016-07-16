export default class Ticker {
  private _nextTickFn: () => void;

  time: number;

  constructor(gameLoop: (dt: number) => void) {
    this.start(gameLoop);
  }

  start(gameLoop: (dt: number) => void) {
    this.time = Date.now();

    const tick = () => {
      const now = Date.now();
      const dt = now - this.time;
      this.time = now;
      gameLoop(dt);
      requestAnimationFrame(this._nextTickFn);
    };

    this._nextTickFn = tick;
    window.requestAnimationFrame(this._nextTickFn);
  }

  stop() {
    this._nextTickFn = () => {};
  }
}