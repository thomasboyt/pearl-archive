import AssetBase from './AssetBase';
import PearlInstance from '../PearlInstance';

export default class AudioAsset extends AssetBase<AudioBuffer> {
  async load(path: string, pearl: PearlInstance) {
    const ctx = pearl.audio.ctx;
    const resp = await fetch(path);
    const buf = await resp.arrayBuffer();

    const decoded = await ctx.decodeAudioData(buf);
    return decoded;
  }
}
