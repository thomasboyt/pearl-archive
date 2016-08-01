import Component from '../Component';
import AssetManager from './AssetManager';

export interface Options {
  defaultGain: number;
}

/**
 * Provides a single location for playing audio assets loaded through `AudioManager`.
 *
 * Example usage:
 *   // Will play the asset with the key of `explosion` in your assets configuration.
 *   audioManager.play('explosion');
 */
export default class AudioManager extends Component<Options> {
  ctx: AudioContext;
  muted: boolean;
  volumeNode: GainNode;
  defaultGain: number;

  init(opts: Options) {
    this.ctx = new AudioContext();

    this.volumeNode = this.ctx.createGain();
    this.volumeNode.connect(this.ctx.destination);

    this.volumeNode.gain.value = opts.defaultGain;

    this.muted = false;
  }

  play(name: string) {
    const sound = this.getComponent(AssetManager).getAudio(name);

    const src = this.ctx.createBufferSource();
    src.connect(this.volumeNode);
    src.buffer = sound;
    src.start(0);
  }

  toggleMute() {
    if (this.muted) {
      this.volumeNode.gain.value = this.defaultGain;
    } else {
      this.volumeNode.gain.value = 0;
    }

    this.muted = !this.muted;
  }
}