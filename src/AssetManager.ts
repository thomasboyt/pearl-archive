import PearlInstance from './PearlInstance';
import AssetBase from './assets/AssetBase';

export type AssetMap = { [key: string]: AssetBase<any> };

export default class AssetManager {
  private assets: AssetMap = {};
  private pearl: PearlInstance;

  constructor(pearl: PearlInstance) {
    this.pearl = pearl;
  }

  setAssets(assets: AssetMap) {
    this.assets = assets;
  }

  load() {
    const promises = Object.keys(this.assets).map((key) =>
      this.assets[key].loadAndSet(this.pearl)
    );
    return Promise.all(promises);
  }

  get<T>(assetType: new (path: string) => AssetBase<T>, name: string): T {
    const asset = this.assets[name];

    if (!asset) {
      throw new Error(`no asset named ${name} found`);
    }

    if (!(asset instanceof assetType)) {
      throw new Error(`asset ${name} is not of type ${assetType}`);
    }

    const loaded = asset.get();

    return loaded;
  }
}
