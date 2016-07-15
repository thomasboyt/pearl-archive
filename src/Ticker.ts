export default class Ticker {
  private _nextTickFn: () => void;

  constructor(gameLoop: (dt: number) => void) {
    this.start(gameLoop);
  }

  start(gameLoop: (dt: number) => void) {
    let prev = Date.now();

    const tick = () => {
      const now = Date.now();
      const dt = now - prev;
      prev = now;
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