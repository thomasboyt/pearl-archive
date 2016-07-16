export type RunFunction = () => void;

export default class Runner {
  private _runs: RunFunction[] = [];

  update() {
    for (let run of this._runs) {
      run();
    }

    this._runs = [];
  }

  add(fn: RunFunction) {
    this._runs.push(fn);
  }
}