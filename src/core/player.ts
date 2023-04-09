import Emitter from './emitter';
import type { MediaItem, YuanPlayerOptions } from './player.d';


/**
 * The base Player class
 * This file does not contains the player UI
 */
class Player extends Emitter {
  container: HTMLElement;
  mediaElement: HTMLMediaElement | null;
  errorCode: number = 0;
  errorMessage: string = '';
  loop = false;
  media: MediaItem | null;
  nativeControls = false;
  static error = {
    MEDIA_ERR_URLEMPTY: {
      code: -2,
      message: 'Media playback command not possible as no media is set.'
    },
    MEDIA_ERR_UNKNOWN: {
      code: -1,
      message: 'An unknown error occurred.'
    },
    MEDIA_ERR_ABORTED: {
      code: 1,
      message: 'You aborted the video playback.'
    },
    MEDIA_ERR_NETWORK: {
      code: 2,
      message: 'A network error caused the video download to fail part-way.'
    },
    MEDIA_ERR_DECODE: {
      code: 3,
      message: 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.'
    },
    MEDIA_ERR_SRC_NOT_SUPPORTED: {
      code: 4,
      message: 'The video could not be loaded, either because the server or network failed or because the format is not supported.'
    }
  };
  constructor(options: YuanPlayerOptions) {
    super();
    for (const prop in options) {
      this[prop] = prop === 'loop' ? options[prop] === 'one' : options[prop];
    }
  }

  /**
   * Defines the media to play.
   * @param media 
   */
  public setMedia(media: MediaItem) {
    this.media = media;
    this.trigger('setmedia');
  }

  /**
   * Plays the media file.
   */
  public play() {
    if (this.mediaElement) {
      const playPromise = this.mediaElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {}).catch(() => {})
      }
    }
  }
  /**
   * moves the play-head to a new position
   * @param percent
   */
  public playHead(percent: number) {
    if (!this.mediaElement) return;
    this.mediaElement.currentTime = percent * this.mediaElement.duration;
  }
  public isPlaying() {
    return this.mediaElement && !this.mediaElement.paused;
  }
  protected togglePlay() {
    const media = this.mediaElement;
    if (!media) return false;
    if (media.paused) {
      const playPromise = media.play();
      // The play() method returns a Promise which is resolved when playback has been successfully started.
      // Note: Browsers released before 2019 may not return a value from play().
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
      if (playPromise !== undefined) {
        playPromise.then(() => {}).catch(() => {})
      }
    } else {
      media.pause();
    }
  }
  /**
   * Stop the media and reset the play-head to the start of the media.
   */
  public stop() {
    const media = this.mediaElement;
    if (media) {
      media.pause();
      media.currentTime = 0;
      this.trigger('stop');
    }
  }
  public toggleLoop() {
    const media = this.mediaElement;
    if (media) {
      media.loop = !media.loop;
    }
    this.trigger('loopchanged');
  }
  /**
   * Pause the media.
   */
  public pause() {
    const media = this.mediaElement;
    if (media) {
      media.pause();
    }
  }
  // TODO
  public pauseOthers() {

  }
  // TODO
  public tellOthers() {

  }

  /**
   * Mutes the media's sounds
   */
  public mute() {
    const media = this.mediaElement;
    if (media) {
      media.muted = true;
    }
  }
  /**
   * Unmutes the media's sounds.
   */
  public unmute() {
    const media = this.mediaElement;
    if (media) {
      media.muted = false;
    }
  }
  protected toggleMute() {
    const media = this.mediaElement;
    if (media) {
      media.muted = !media.muted;
    }
  }
  /**
   * This method is used to control the volume of the media being played.
   * Silence: 0
   * Half: 0.5
   * Maximum: 1
   * @param ratio - Number (0 to 1) defining the ratio of maximum volume.
   */
  public volume(ratio: number) {
    if (!this.mediaElement) return;
    this.mediaElement.volume = (ratio >= 1.0) ? 1.0 : ratio;
  }
  public setPlaybackRate(rate: number) {
    if (!this.mediaElement) return;
    this.mediaElement.playbackRate = rate;
  }
  /**
   * This method is used to clear the media and stop playback.
   * If a media file is downloading at the time, the download will be cancelled.
   */
  public clearMedia() {
    if (!this.mediaElement) return false;
    this.stop();
    this.mediaElement.innerHTML = '';
    this.mediaElement.src = '';
    this.trigger('clearmedia');
  }
  /**
   * Removes YuanPlayer.
   * All event and interface bindings created are removed.
   */
  public destroy() {
    this.clearMedia();
    this.removeAllEventListeners();
    this.eventHandlers = {};
    if (this.mediaElement) {
      this.mediaElement.remove();
    }
    this.mediaElement = null;
    this.errorCode = 0;
    this.errorMessage = '';
    this.loop = false;
    this.media = null;
    this.nativeControls = false;
    this.trigger('destroy');
  }
}

export default Player;