// Implementation based on the `co` package https://github.com/tj/co
// This may be replaced with co or a similar third-party dependency in the future

export type Yieldable = Promise<any> | CoroutineIterator;

// the "interface" thing here is a workaround for not being able to nest types like e.g.
// export type CoroutineIterator = IterableIterator<Yieldable>;
export interface CoroutineIterator extends IterableIterator<Yieldable> {}

export type Coroutine = () => CoroutineIterator;

function asPromise(val: Yieldable): Promise<any> {
  // TODO: having to cast to any to duck-type this sucks, is there something better that works in
  // typescript?
  if ((val as any).then) {
    return val as Promise<any>;
  } else {
    return runCoroutine(val as CoroutineIterator);
  }
}

export function runCoroutine(genObj: CoroutineIterator): Promise<any> {
  return new Promise((resolve, reject) => {
    function onFulfill(res?: any) {
      let ret: IteratorResult<Yieldable>;

      try {
        ret = genObj.next(res);
      } catch (err) {
        return reject(err);
      }

      next(ret);
    }

    function onReject(err: Error) {
      let ret: IteratorResult<Yieldable>;

      try {
        ret = genObj.throw!(err);
      } catch (err) {
        return reject(err);
      }

      next(ret);
    }

    function next(ret: IteratorResult<Yieldable>) {
      if (ret.done) {
        resolve();
        return;
      }

      asPromise(ret.value).then(onFulfill, onReject);
    }

    onFulfill();
  });
}
