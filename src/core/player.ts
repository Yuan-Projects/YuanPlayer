import { createElement, getMediaMimeType, includes, isArray, isHtml5AudioSupported, isHLSJSSupported, isHLSNativelySupported } from './utils';
import Emitter from './emitter';
import type { MediaItem, YuanPlayerOptions } from './player.d';
declare var Hls;

/**
 * Render the <audio> tag into a specific DOM element
 * And add listeners for media playback events
 * This file does not contains the player UI
 */
class Player extends Emitter {
  container: HTMLElement;
  mediaElement: HTMLMediaElement | null;
  errorCode: number;
  errorMessage: string;
  loop = false;
  media: MediaItem | null;
  nativeControls = false;
  isAudioSupported = false;
  eventListeners: Array<any> = [];
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
    if (isHtml5AudioSupported()) {
      //throw new Error("Your browser does not support HTML5 Audio.");
      this.isAudioSupported = true;
    }

    this.errorCode = 0;
    this.errorMessage = '';
    this.eventHandlers = {};

    this.init(options);
  }

  private init(options: YuanPlayerOptions) {
    this.initOptions(options);
    // If no valid container exists, we do nothing.
    if(!this.container) return ;
    this.addMediaElement();
    this.bindMediaEvents();
  }

  private initOptions(options: YuanPlayerOptions) {
    for (const prop in options) {
      this[prop] = prop === 'loop' ? options[prop] === 'one' : options[prop];
    }
  }

  private addMediaElement() {
    const div = createElement('div');
    const mediaElement = this.addMediaElementTag();

    this.addMediaSource();

    div.appendChild(mediaElement);
    this.container.appendChild(div);
  }

  private addMediaElementTag() {
    const attrs = {
      preload: "metadata",
      controls: !!this.nativeControls,
      loop: typeof this.loop !== "undefined" ? !!this.loop : false
    };
    const videoAttrs: any =  {
      ...attrs,
      style: "width: 100%;"
    };
    if (this.media?.poster) {
      videoAttrs.poster = this.media.poster;
    }
    const mediaElement = this.isVideo(this.media) ? createElement('video', videoAttrs) : createElement('audio', attrs);
    this.mediaElement = mediaElement;
    return mediaElement;
  }
  /**
   * Determine if current track is a video.
   * @param media - The media object
   * @returns boolean
   */
  private isVideo(media: any): boolean {
    if (typeof media.isVideo === 'boolean') return media.isVideo;
    const src = media.src;
    if (!src) return false;
    // TODO: .ogg, mp4 can be used as both video and audio
    const videoExts = ['ogm', 'ogv', 'webm', 'mp4', 'm4v'];
    const srcs = isArray(src) ? [...src] : [src];
    for (const link of srcs) {
      const ext = link.split('.').pop();
      if (includes(videoExts, ext)) {
        return true;
      }
    }
    return false;
  }

  private bindMediaEvents() {
    const that = this;
    const media = this.mediaElement;
    if (!media) return ;

    const t = window.setInterval(function() {
      if (media?.networkState === 3) {
        that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
        that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
        clearInterval(t);
        that.trigger('error');
      }
    }, 100);

    const mediaEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
    mediaEvents.forEach(event => {
      this.addEventListener(media, event, () => this.trigger(event));
    });

    this.addEventListener(media, 'error', function(e: any) {
      switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
          that.errorCode = Player.error.MEDIA_ERR_ABORTED.code;
          that.errorMessage = Player.error.MEDIA_ERR_ABORTED.message;
          break;
        case e.target.error.MEDIA_ERR_NETWORK:
          that.errorCode = Player.error.MEDIA_ERR_NETWORK.code;
          that.errorMessage = Player.error.MEDIA_ERR_NETWORK.message;
          break;
        case e.target.error.MEDIA_ERR_DECODE:
          that.errorCode = Player.error.MEDIA_ERR_DECODE.code;
          that.errorMessage = Player.error.MEDIA_ERR_DECODE.message;
          break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          that.errorCode = Player.error.MEDIA_ERR_SRC_NOT_SUPPORTED.code;
          that.errorMessage = Player.error.MEDIA_ERR_SRC_NOT_SUPPORTED.message;
          break;
        default:
          that.errorCode = Player.error.MEDIA_ERR_UNKNOWN.code;
          that.errorMessage = Player.error.MEDIA_ERR_UNKNOWN.message;
          break;
      }
      clearInterval(t);
      that.trigger('error');
    });
  }

  protected addEventListener(target, type, listener) {
    target.addEventListener(type, listener);
    this.eventListeners.push([target, type, listener]);
  }

  protected removeEventListener(target, type, listener) {
    target.removeEventListener(type, listener);
    for (let i = 0; i < this.eventListeners.length; i++) {
      const [target1, type1, listener1] = this.eventListeners[i];
      if (target1 === target && type1 === type && listener1 === listener) {
        this.eventListeners.splice(i, 1);
        break;
      }
    }
  }

  private addMediaSource() {
    if (!this.media || !this.media.src || !this.mediaElement) return false;

    this.mediaElement.innerHTML = '';
    this.mediaElement.removeAttribute('src');
    let src = this.media.src;
    if (typeof src === 'string') {
      src = [src];
    }
    for (let i = 0; i < src.length; i++) {
      this.addSourceElement(src[i], !!this.media.isVideo);
    }
    setTimeout(() => {
      this.trigger('setmedia');
    }, 30);
  }

  /**
   * Defines the media to play.
   * @param media 
   */
  public setMedia(media: MediaItem) {
    this.media = media;
    const expectedTag = this.isVideo(this.media) ? 'video' : 'audio';
    // If the new media file has a different tag name
    // Remove the existing tag, remove its event handlers
    // Then create a new tag and add events listeners again.
    if (this.mediaElement && this.mediaElement?.tagName.toLowerCase() !== expectedTag) {
      const div = this.mediaElement.parentNode;
      this.eventListeners.forEach(([target, type, listener]) => {
        // Only those event handlers attached to the old tag need to be removed
        if (target === this.mediaElement) {
          target.removeEventListener(type, listener);
        }
      });
      this.clearMedia();
      this.eventListeners.length = 0;
      this.mediaElement.remove();
      this.mediaElement = null;

      // add new tag
      const mediaElement = this.addMediaElementTag();
      div?.appendChild(mediaElement);
      this.bindMediaEvents();
    }
    this.addMediaSource();
    this.mediaElement?.load();
  }

  public formatTime(secs: number): string {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
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

  private addSourceElement(src: string, isVideo = false) {
    const sourceElement = createElement('source', {
      src: this.processSrc(src),
      type: getMediaMimeType(src, isVideo)
    });
    if (this.mediaElement) {
      this.mediaElement.appendChild(sourceElement);
    }
  }

  private processSrc(src: string): string {
    const fileExtension = src.split('.').pop();
    if (fileExtension === 'm3u8' && !isHLSNativelySupported()) {
      if (isHLSJSSupported()) {
        const hlsInstance = new Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(this.mediaElement);
      } else {
        console.warn(`HLS is not supported in your browsers. Please make sure you are using a modern browser and/or have imported hls.js correctly.`);
      }
    }
    return src;
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
  // TODO
  /**
   * Removes YuanPlayer.
   * All event and interface bindings created are removed.
   */
  public destroy() {
    this.clearMedia();
    this.eventListeners.forEach(([target, type, listener]) => {
      target.removeEventListener(type, listener);
    });
    this.eventListeners.length = 0;
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
    this.isAudioSupported = false;
    this.trigger('destroy');
  }
}

export default Player;