import PearlInstance from '../PearlInstance';

export default abstract class Asset<T> {
  path: string;
  private loaded?: T;

  constructor(path: string) {
    this.path = path;
  }

  get(): T {
    if (!this.loaded) {
      throw new Error('not loaded yet!');
    }

    return this.loaded;
  }

  async loadAndSet(pearl: PearlInstance) {
    this.loaded = await this.load(pearl);
  }

  abstract load(pearl: PearlInstance): Promise<T>;
}
