import { isHtml5AudioSupported } from './utils';
import Emitter from './emitter';
import type { MediaItem, YuanPlayerOptions } from './player.d';

/**
 * Render the <audio> tag into a specific DOM element
 * And add listeners for media playback events
 * This file does not contains the player UI
 */
class Player extends Emitter {
  container: HTMLElement;
  mediaObject: HTMLAudioElement;
  errorCode: number;
  errorMessage: string;
  eventHandlers: object;
  loop = false;
  media: MediaItem;
  nativeControls = false;
  isAudioSupported = false;
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
      // @ts-ignore
      this[prop] = prop === 'loop' ? options[prop] === 'one' : options[prop];
    }
  }

  private addMediaElement() {
    const div = document.createElement('div');
    var mediaElement = document.createElement('audio');
    mediaElement.preload = "metadata";
    this.mediaObject = mediaElement;

    mediaElement.controls = !!this.nativeControls;
    if ( typeof this.loop !== "undefined") {
      mediaElement.loop = !!this.loop;
    }

    this.addMediaSource();

    div.appendChild(mediaElement);
    this.container.appendChild(div);
  }

  private bindMediaEvents() {
    var that = this;
    var media = this.mediaObject;
    if (!media) return ;

    var t = window.setInterval(function(){
      if (media.networkState === 3) {
        that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
        that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
        clearInterval(t);
        that.trigger('error');
      }
    }, 100);

    const mediaEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
    mediaEvents.forEach(event => {
      media.addEventListener(event, () => this.trigger(event), false);
    });

    media.addEventListener('error', function(e: any) {
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
    }, false);
    // Fixes for Android 2.2,this event will be triggered in Android 2.2 when the media file load failed with HTTP status 403.
    media.addEventListener('stalled', function() {
      that.trigger('stalled');
      that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
      that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
      that.trigger('error');
      clearInterval(t);
      }, false);
  }

  private addMediaSource(){
    if (!this.media || !this.media.src) return false;

    this.mediaObject.innerHTML = '';
    this.mediaObject.removeAttribute('src');
    let src = this.media.src;
    if (typeof src === 'string') {
      src = [src];
    }
    for (var i = 0; i < src.length; i++) {
      this.addSourceElement(src[i]);
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
    this.addMediaSource();
    this.mediaObject.load();
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
    if (this.mediaObject && this.mediaObject.currentSrc) {
      const playPromise = this.mediaObject.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {}).catch(error => {})
      }
    }
  }
  /**
   * moves the play-head to a new position
   * @param percent
   */
  public playHead(percent: number) {
    this.mediaObject.currentTime = percent * this.mediaObject.duration;
  }
  public isPlaying() {
    return this.mediaObject && !this.mediaObject.paused;
  }
  protected togglePlay() {
    var media = this.mediaObject;
    if (!media) return false;
    if (media.paused) {
      const playPromise = media.play();
      // The play() method returns a Promise which is resolved when playback has been successfully started.
      // Note: Browsers released before 2019 may not return a value from play().
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
      if (playPromise !== undefined) {
        playPromise.then(() => {}).catch(error => {})
      }
    } else {
      media.pause();
    }
  }
  /**
   * Stop the media and reset the play-head to the start of the media.
   */
  public stop(){
    var media = this.mediaObject;
    if (media) {
      media.pause();
      media.currentTime = 0;
      this.trigger('stop');
    }
  }
  public toggleLoop() {
    var media = this.mediaObject;
    if (media) {
      media.loop = !media.loop;
    }
    this.trigger('loopchanged');
  }
  /**
   * Return MIME type for the media file.
   * @param fileName 
   * @returns 
   */
  protected getMimeType(fileName: string): string {
    var type = 'wav';
    if (fileName) {
      var fileExtension = fileName.split('.').pop();
      if (fileExtension === 'm3u8') {
        if (this.mediaObject.canPlayType('application/x-mpegURL')) {
          return 'application/x-mpegURL';
        } else if (this.mediaObject.canPlayType('application/vnd.apple.mpegURL')) {
          return 'application/vnd.apple.mpegURL';
        }
      }
      switch(fileExtension) {
        case 'aac':
          type = 'aac';
          break;
        case 'mp4':
        case 'm4a':
          type = 'mp4';
          break;
        case 'mp1':
        case 'mp2':
        case 'mp3':
        case 'mpg':
        case 'mpeg':
          type = 'mpeg';
          break;
        case 'oga':
        case 'ogg':
          type = 'ogg';
          break;
        case 'wav':
          type = 'wav';
          break;
        case 'webm':
          type = 'webm';
          break;
        default :
          type = 'wav';
      }
    }
    return 'audio/' + type;
  }
  /**
   * Pause the media.
   */
  public pause(){
    var media = this.mediaObject;
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

  private addSourceElement(src: string) {
    var sourceElement = document.createElement('source');
    sourceElement.src = this.processSrc(src);
    sourceElement.type = this.getMimeType(src);
    this.mediaObject.appendChild(sourceElement);
  }

  private processSrc(src: string): string {
    var fileExtension = src.split('.').pop();
    if (fileExtension === 'm3u8' && !this.isHLSNativelySupported()) {
      if (this.isHLSJSSupported()) {
        // @ts-ignore
        const hlsInstance = new Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(this.mediaObject);
      } else {
        console.warn(`HLS is not supported in your browsers. Please make sure you are using a modern browser and/or have imported hls.js correctly.`);
      }
    }
    return src;
  }

  private isHLSNativelySupported() {
    return this.mediaObject.canPlayType('application/x-mpegURL') || this.mediaObject.canPlayType('application/vnd.apple.mpegURL');
  }
  private isHLSJSSupported() {
    // @ts-ignore
    return typeof Hls === 'function' && Hls.isSupported();
  }
  /**
   * Mutes the media's sounds
   */
  public mute() {
    var media = this.mediaObject;
    if (media) {
      media.muted = true;;
    }
  }
  /**
   * Unmutes the media's sounds.
   */
  public unmute() {
    var media = this.mediaObject;
    if (media) {
      media.muted = false;
    }
  }
  protected toggleMute() {
    var media = this.mediaObject;
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
    this.mediaObject.volume = (ratio >= 1.0) ? 1.0 : ratio;
  }
  /**
   * This method is used to clear the media and stop playback.
   * If a media file is downloading at the time, the download will be cancelled.
   */
  public clearMedia() {
    if (!this.mediaObject) return false;
    this.stop();
    this.mediaObject.innerHTML = '';
    this.mediaObject.src = '';
    this.trigger('clearmedia');
  }
  // TODO
  /**
   * Removes YuanPlayer.
   * All event and interface bindings created are removed.
   */
  public destroy() {
    this.trigger('destroy');
  }
}

export default Player;