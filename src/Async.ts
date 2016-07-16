import {runCoroutine, Coroutine} from './util/coroutines';

export default class AsyncManager {
  private _time: number;
  private _timers: Map<number, (value?: any) => void> = new Map();

  waitMs(ms: number): Promise<null> {
    return new Promise((resolve, reject) => {
      this._timers.set(this._time + ms, resolve);
    });
  }

  schedule(coroutine: Coroutine) {
    runCoroutine(coroutine());
  }

  startAt(time: number) {
    this._time = time;
  }

  update(dt: number) {
    this._time += dt;

    // removing items while iterating over them *should* be okay as per
    // http://stackoverflow.com/a/28306768
    // TODO: This doesn't enforce timers being resolved in scheduled order!!! Need an ordered
    // data structure
    for (let [ms, resolve] of this._timers.entries()) {
      if (this._time >= ms) {
        resolve();
        this._timers.delete(ms);
      }
    }
  }
}