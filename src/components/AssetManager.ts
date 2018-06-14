import Component from '../Component';

import AudioManager from './AudioManager';

export type AssetMap = {
  images: {
    [key: string]: HTMLImageElement;
  };
  audio: {
    [key: string]: AudioBuffer;
  };
};

export interface StringMap {
  [key: string]: string;
}

export type AssetCfg = {
  images: StringMap;
  audio: StringMap;
};

export default class AssetManager extends Component<AssetCfg> {
  numTotal: number;
  numLoaded: number = 0;
  audioCtx: AudioContext;

  _assetCfg: AssetCfg;

  private assets: AssetMap;

  init(assetCfg: AssetCfg) {
    this.assets = {
      images: {},
      audio: {},
    };

    this._assetCfg = assetCfg;

    this.numTotal =
      Object.keys(this._assetCfg.images).length +
      Object.keys(this._assetCfg.audio).length;

    const audioCtx = this.getComponent(AudioManager).ctx;

    if (!audioCtx) {
      throw new Error(
        "AudioManager's AudioContext not yet initialized - make sure AudioManager is before " +
          'AssetManager in your components array'
      );
    }

    this.audioCtx = audioCtx;
  }

  load(): Promise<AssetMap> {
    return new Promise((resolve, reject) => {
      if (this.numTotal === 0) {
        // no assets, resolve immediately
        resolve(this.assets);
      }

      // TODO: Create PreloadUI here

      const onAssetLoaded = () => {
        this.numLoaded += 1;

        if (this.numTotal === this.numLoaded) {
          resolve(this.assets);
        }
      };

      for (let name of Object.keys(this._assetCfg.images)) {
        const src = this._assetCfg.images[name];

        const img = new Image();
        img.onload = onAssetLoaded;
        img.src = src;

        this.assets.images[name] = img;
      }

      for (let name of Object.keys(this._assetCfg.audio)) {
        const src = this._assetCfg.audio[name];

        const xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = () => {
          this.audioCtx.decodeAudioData(xhr.response, (buf) => {
            this.assets.audio[name] = buf;
            onAssetLoaded();
          });
        };

        xhr.send();
      }
    });
  }

  getImage(name: string): HTMLImageElement {
    const image = this.assets.images[name];

    if (!image) {
      throw new Error(`No image asset named ${name}`);
    }

    return image;
  }

  getAudio(name: string): AudioBuffer {
    const sound = this.assets.audio[name];

    if (!sound) {
      throw new Error(`No audio asset named ${name}`);
    }

    return sound;
  }
}
