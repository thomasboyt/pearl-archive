// Implementation based on the `co` package https://github.com/tj/co

export type Yieldable = Promise<any> | IterableIterator<Yieldable>;
export type CoroutineIterator = IterableIterator<Yieldable>;
export type Coroutine = () => CoroutineIterator;

export default class AsyncManager {
  private _time: number;
  private _timers: Map<number, (value?: any) => void> = new Map();

  startAt(time: number) {
    this._time = time;
  }

  private _asPromise(val: Yieldable): Promise<any> {
    // TODO: having to cast to any to duck-type this sucks, is there something better that works in
    // typescript?
    if ((val as any).then) {
      return val as Promise<any>;
    } else {
      return this._run(val);
    }
  }

  private _run(genObj: CoroutineIterator): Promise<any> {
    return new Promise((resolve, reject) => {
      function onFulfill(res?: any) {
        let ret: IteratorResult<Yieldable>;

        try {
          ret = genObj.next(res);
        } catch(err) {
          return reject(err);
        }

        next(ret);
      }

      function onReject(err: Error) {
        let ret: IteratorResult<Yieldable>;

        try {
          ret = genObj.throw!(err);
        } catch(err) {
          return reject(err);
        }

        next(ret);
      }

      const next = (ret: IteratorResult<Yieldable>) => {
        if (ret.done) {
          resolve();
          return;
        }

        this._asPromise(ret.value).then(onFulfill, onReject);
      }

      onFulfill();
    });
  }

  waitMs(ms: number): Promise<null> {
    return new Promise((resolve, reject) => {
      this._timers.set(this._time + ms, resolve);
    });
  }

  schedule(coroutine: Coroutine) {
    const obj = coroutine();
    this._run(coroutine());
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