import { runCoroutine, Coroutine } from './util/coroutines';

type Resolve = (value?: any) => void;

export default class AsyncManager {
  private _time: number;
  private _timers: Map<number, Resolve[]> = new Map();

  /**
   * Schedule a coroutine to be executed.
   */
  schedule(coroutine: Coroutine) {
    runCoroutine(coroutine());
  }

  /**
   * Returns a yieldable promise to wait a certain amount of milliseconds. Once a time-scale system
   * is implemented, this will wait the *time-scaled* duration - so if you wait 50 ms and set your
   * time scale to 1/2 speed, it will take 100 ms to resolve.
   */
  waitMs(ms: number): Promise<null> {
    return new Promise((resolve, reject) => {
      const scheduledTime = this._time + ms;

      if (this._timers.has(scheduledTime)) {
        this._timers.get(scheduledTime)!.push(resolve);
      } else {
        this._timers.set(this._time + ms, [resolve]);
      }
    });
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
    for (let [ms, resolvers] of this._timers.entries()) {
      if (this._time >= ms) {
        for (let resolve of resolvers) {
          resolve();
        }

        this._timers.delete(ms);
      }
    }
  }
}
