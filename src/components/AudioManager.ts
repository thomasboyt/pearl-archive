import Component from '../Component';
import AssetManager from './AssetManager';

export interface Options {
  defaultGain: number;
}

function getAudioContextClass(): typeof AudioContext {
  if (!(window as any).AudioContext) {
    return (window as any).webkitAudioContext;
  } else {
    return AudioContext;
  }
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

  create(opts: Options) {
    const envAudioContext = getAudioContextClass();
    this.ctx = new envAudioContext();

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
