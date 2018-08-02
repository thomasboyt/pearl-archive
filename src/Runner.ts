export type RunFunction = () => void;

/**
 * This class can be used to manually add functions to run at the end of a run
 * loop tick. It's primarily meant for internal use by dev tooling (like
 * pearl-inspect), and may not remain public without a good use case.
 */
export default class Runner {
  private _fns: RunFunction[] = [];

  update() {
    // iterate over a copy here so that functions added by runner functions
    // (e.g. recursive loops) aren't run on this frame
    const fns = [...this._fns];
    this._fns = [];

    for (let fn of fns) {
      fn();
    }
  }

  add(fn: RunFunction) {
    this._fns.push(fn);
  }
}
