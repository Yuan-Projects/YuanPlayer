import Player from "./player";
import { includes, isArray, isHLSJSSupported, isHLSNativelySupported, getMediaMimeType, createElement, formatTime, debounce, getFullScreenElement, matches, trunc, uuidv4, isFullScreen, isFullScreenEnabled, exitFullscreen, requestFullscreen } from './utils';
import type { CSSSelector, YuanPlayerOptions } from "./player.d";
declare var Hls;

export default abstract class PlayerUI extends Player {
  protected useStateClassSkin = false;
  protected cssSelectorAncestor: string = '';
  protected cssSelector: CSSSelector = {
    videoPlay: ".yuan-video-play",
    play: ".yuan-play",
    pause: ".yuan-pause",
    stop: ".yuan-stop",
    seekBar: ".yuan-seek-bar",
    playBar: ".yuan-play-bar",
    mute: ".yuan-mute",
    unmute: ".yuan-unmute",
    volumeBar: ".yuan-volume-bar",
    volumeBarValue: ".yuan-volume-bar-value",
    volumeMax: ".yuan-volume-max",
    volumeValue: '.yuan-volume-value',
    playbackRateBar: ".yuan-playback-rate-bar",
    playbackRateBarValue: ".yuan-playback-rate-bar-value",
    currentTime: ".yuan-current-time",
    duration: ".yuan-duration",
    title: ".yuan-title",
    fullScreen: ".yuan-full-screen",
    restoreScreen: ".yuan-restore-screen",
    repeat: ".yuan-repeat",
    repeatOff: ".yuan-repeat-off",
    gui: ".yuan-gui",
    noSolution: ".yuan-no-solution"
  };
  protected stateClass = {
    repeatOne: "yuan-repeat-one",
    playing: "yuan-state-playing",
    seeking: "yuan-state-seeking",
    muted: "yuan-state-muted",
    looped: "yuan-state-looped",
    fullScreen: "yuan-state-full-screen",
    noVolume: "yuan-state-no-volume"
  };
  private fullScreenElement; // Keep a reference to a previous fullscreen element
  constructor(options: YuanPlayerOptions) {
    super(options);
    // If no valid container exists, we do nothing.
    if(this.container) {
      this.cssSelectorAncestor = options.cssSelectorAncestor || `#yuan_container_${uuidv4()}`;
      this.useStateClassSkin = !!options.useStateClassSkin;
      this.cssSelector = {
        ...this.cssSelector,
        ...options.cssSelector
      };
      this.stateClass = {
        ...this.stateClass,
        ...options.stateClass
      };
      if (!this.nativeControls && this.isAudioSupported) {
        this.addSyntheticEventListeners();
        this.onReady();
        this.setMedia(options.media); // `setMedia()` must be called after `this.addSyntheticEventListeners()`
        this.addEventListeners();
      }
      if (!this.isAudioSupported) {
        setTimeout(() => {
          const element = document.querySelector(`${this.cssSelectorAncestor} ${this.cssSelector.noSolution}`) as HTMLElement;
          if (element) {
            element.style.display = 'block';
          }
        }, 0);
      }
    }
  }
  protected abstract onReady();
  /**
   * Add event listeners for current <audio> or <video> element.
   */
  protected bindMediaEvents() {
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
  /**
   * Create a div which contains the `<audio>` or `<video>` element.
   * @returns A div which container the `<audio>` or `<video>` element.
   */
  protected addMediaElement() {
    const div = createElement('div');
    const mediaElement = this.addMediaElementTag();

    this.addMediaSource();

    div.appendChild(mediaElement);
    this.container.insertAdjacentElement('afterbegin', div);
  }
  protected addMediaSource() {
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
  }
  private addSourceElement(src: string, isVideo = false) {
    if (!this.mediaElement) return;
    const sourceElement = createElement('source', {
      src: this.processSrc(src),
      type: getMediaMimeType(src, isVideo)
    });
    this.mediaElement.appendChild(sourceElement);
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
   * Create a `<video>` or `<audio>` tag, and set it as `this.mediaElement` value.
   * @returns a HTMLMediaElement node.
   */
  protected addMediaElementTag(): HTMLMediaElement {
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
  protected isVideo(media: any): boolean {
    if (typeof media.isVideo === 'boolean') return media.isVideo;
    const src = media.src;
    if (!src) return false;
    // .ogg, mp4 can be used as both video and audio
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

  private addSyntheticEventListeners() {
    const seekingFn = () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement || !this.cssSelector.seekBar || !this.stateClass.seeking) return;
      const element = domElement.querySelector(this.cssSelector.seekBar);
      element?.classList.add(this.stateClass.seeking);
    };
    const seekedFn = () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement || !this.cssSelector.seekBar || !this.stateClass.seeking) return;
      const element = domElement.querySelector(this.cssSelector.seekBar);
      element?.classList.remove(this.stateClass.seeking);
    };
    this.on('waiting', seekingFn);
    this.on('seeking', seekingFn);
    this.on('playing', seekedFn);
    this.on('seeked', seekedFn);
    this.on('ended', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      domElement?.classList.remove(this.stateClass.playing);
    });
    this.on('durationchange', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!this.cssSelector.duration) return false;
      const element = domElement?.querySelector(this.cssSelector.duration);
      if (element) {
        element.textContent = formatTime(this.mediaElement ? Math.floor(this.mediaElement.duration) : 0);
      }
    });
    this.on('setmedia', () => {
      const expectedTag = this.isVideo(this.media) ? 'video' : 'audio';
      if (!this.mediaElement) { // The media element has not been created
        this.addMediaElement();
        this.bindMediaEvents();
      } else {
        // If the new media file has a different tag name
        // Remove the existing tag, remove its event handlers
        // Then create a new tag and add events listeners again.
        if (this.mediaElement.tagName.toLowerCase() !== expectedTag) {
          const div = this.mediaElement.parentNode;
          let i = 0;
          while (i < this.eventListeners.length) {
            const [target, type, listener] = this.eventListeners[i];
            // Only those event handlers attached to the old tag need to be removed
            if (target === this.mediaElement) {
              target.removeEventListener(type, listener);
              this.eventListeners.splice(i, 1);
            } else {
              i++;
            }
          }
          this.clearMedia();
          this.mediaElement.remove();
          this.mediaElement = null;

          // add new tag
          const mediaElement = this.addMediaElementTag();
          div?.appendChild(mediaElement);
          this.bindMediaEvents();
        }
        // Update `<source>` elements and load the media file
        this.addMediaSource();
        this.mediaElement?.load();
      }
    });
    this.on('setmedia', () => {
      if (!this.cssSelector?.fullScreen) return false;
      const fullScreenBtn = this.container?.querySelector(this.cssSelector?.fullScreen) as HTMLElement;
      if (!fullScreenBtn || !isFullScreenEnabled()) return;
      if (this.isVideo(this.media)) {
        fullScreenBtn.style.display = 'inline-block';
      } else {
        fullScreenBtn.style.display = 'none';
      }
    });
    this.on('setmedia', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!this.cssSelector.title) return false;
      const element = domElement?.querySelector(this.cssSelector.title);
      if (element) {
        element.textContent = this.media?.title || '';
      }
      if (this.mediaElement?.tagName === 'AUDIO') {
        this.handleFullscreen(false);
      }
    });
    this.on('setmedia', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return false;
      if (this.cssSelector.currentTime) {
        domElement.querySelector(this.cssSelector.currentTime)!.textContent = formatTime(0);
      }
      if (this.cssSelector.duration) {
        domElement.querySelector(this.cssSelector.duration)!.textContent = formatTime(0);
      }
    });
    this.on('setmedia', () => {
      this.updateVolume();
      this.updateLoopState();
    });
    this.on('error', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return;
      if (this.errorCode === -2 || this.errorCode === 4) {
        if (this.cssSelector.currentTime) {
          domElement.querySelector(this.cssSelector.currentTime)!.textContent = formatTime(0);
        }
        if (this.cssSelector.duration) {
          domElement.querySelector(this.cssSelector.duration)!.textContent = formatTime(0);
        }
        if (this.cssSelector.playBar) {
          (domElement.querySelector(this.cssSelector.playBar) as HTMLElement).style.width = `0%`;
        }
      }
    });
    this.on('timeupdate', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return false;
      const second = this.mediaElement ? Math.floor(this.mediaElement.currentTime) : 0;
      if (this.cssSelector.currentTime) {
        domElement.querySelector(this.cssSelector.currentTime)!.textContent = formatTime(second);
      }
      if (this.cssSelector.playBar) {
        const element = (domElement.querySelector(this.cssSelector.playBar) as HTMLElement);
        if (element) {
          const perc = this.mediaElement && isFinite(this.mediaElement.duration) ? this.mediaElement.currentTime / this.mediaElement.duration : 0;
          element.style.width = `${perc * 100}%`;
        }
      }
    });
    this.on('play', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return;
      // If current src is empty, we should not add the state class
      if (this.mediaElement?.currentSrc) {
        domElement.classList.add(this.stateClass.playing);
      }
    });
    this.on('pause', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return;
      domElement.classList.remove(this.stateClass.playing);
    });
    this.on('stop', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return;
      domElement.classList.remove(this.stateClass.playing);
      if (this.cssSelector.currentTime) {
        domElement.querySelector(this.cssSelector.currentTime)!.textContent = formatTime(0);
      }
      if (this.cssSelector.playBar) {
        (domElement.querySelector(this.cssSelector.playBar) as HTMLElement).style.width = `0%`;
      }
    });
    this.on('clearmedia', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return;
      domElement?.classList.remove(this.stateClass.playing);
      if (this.cssSelector.currentTime) {
        domElement.querySelector(this.cssSelector.currentTime)!.textContent = formatTime(0);
      }
      if (this.cssSelector.duration) {
        domElement.querySelector(this.cssSelector.duration)!.textContent = formatTime(0);
      }
      if (this.cssSelector.playBar) {
        (domElement.querySelector(this.cssSelector.playBar) as HTMLElement).style.width = `0%`;
      }
      if (this.cssSelector.title) {
        const element = (domElement.querySelector(this.cssSelector.title) as HTMLElement);
        if (element) {
          element.textContent = '';
        }
      }
    });
    this.on('volumechange', () => {
      this.updateVolume();
    });
    this.on('loopchanged', () => {
      this.updateLoopState();
    });
  }
  private addEventListeners() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (isFullScreenEnabled()) {
      const debouncedHide = debounce(() => {
        domElement.style.display = 'none';
      }, 1000);
      const fullScreenVideoHandler = () => {
        domElement.style.display = 'block';
        debouncedHide();
      };
      const fullScreenGUIHandler = () => {
        clearTimeout(debouncedHide.timer());
      };
      const fullScreenGUIHandler2 = () => {
        domElement.style.display = 'none';
      };
      const fullscreenchangeFn = () => {
        const isFullScreenMode = isFullScreen();
        const fullScreenElement = getFullScreenElement();
        const restoreGUI = (scrollIntoView: boolean = false) => {
          domElement.style.display = 'block';
          (this.mediaElement as HTMLElement).style.position = 'static';
          (this.mediaElement as HTMLElement).style.height = 'auto';
          clearTimeout(debouncedHide.timer());
          this.removeEventListener(this.mediaElement as HTMLElement, 'mousemove', fullScreenVideoHandler);
          this.removeEventListener(domElement, 'mouseenter', fullScreenGUIHandler);
          this.removeEventListener(domElement, 'mouseleave', fullScreenGUIHandler2);
          if (scrollIntoView) {
            this.mediaElement?.scrollIntoView({
              block: "center",
              inline: "center"
            });
          }
        };
        const bindFullScreenListeners = () => {
          domElement.style.display = 'none';
          (this.mediaElement as HTMLElement).style.position = 'fixed';
          (this.mediaElement as HTMLElement).style.height = '100%';
          this.addEventListener(this.mediaElement, 'mousemove', fullScreenVideoHandler);
          this.addEventListener(domElement, 'mouseenter', fullScreenGUIHandler);
          this.addEventListener(domElement, 'mouseleave', fullScreenGUIHandler2);
        };
        if (isFullScreenMode) { // enter fullscreen
          this.fullScreenElement = fullScreenElement;
          // if the fullscreenchange is not triggered by current player
          // we restore the GUI of current player
          if (fullScreenElement !== this.container) {
            restoreGUI(false);
            this.setFullscreenData(false);
            return false;
          } else {
            bindFullScreenListeners();
            this.setFullscreenData(true);
            return false;
          }
        } else { // exit fullscreen
          if (this.fullScreenElement === this.container) {
            restoreGUI(true);
            this.setFullscreenData(false);
          }
          this.fullScreenElement = null;
        }
      };
      this.addEventListener(document, 'fullscreenchange', fullscreenchangeFn);
      this.addEventListener(document, 'webkitfullscreenchange', fullscreenchangeFn);
      this.addEventListener(document, 'mozfullscreenchange', fullscreenchangeFn);
      this.addEventListener(document, 'msfullscreenchange', fullscreenchangeFn);
      this.addEventListener(document, 'MSFullscreenChange', fullscreenchangeFn);
    }
    const clickHandler = (e) => {
      const target = e.target as HTMLElement;
      if (this.isMatchedWithSelector(target, this.cssSelector.play)) {
        if (this.useStateClassSkin) {
          this.togglePlay();
        } else {
          this.play();
        }
      } else if (this.isMatchedWithSelector(target, this.cssSelector.pause)) {
        if (this.useStateClassSkin) {
          this.togglePlay();
        } else {
          this.pause();
        }
      } else if (this.isMatchedWithSelector(target, this.cssSelector.fullScreen)) {
        if (this.useStateClassSkin) {
          this.handleFullscreen();
        } else {
          this.handleFullscreen(true);
        }
      } else if (this.isMatchedWithSelector(target, this.cssSelector.stop)) {
        this.stop();
      } else if (this.isMatchedWithSelector(target, this.cssSelector.repeat)) {
        // TODO
        domElement.classList.toggle(this.stateClass.looped);
      } else if (this.isMatchedWithSelector(target, this.cssSelector.volumeMax)) {
        this.volume(1);
        this.unmute();
      } else if (this.isMatchedWithSelector(target, this.cssSelector.mute)) {
        if (this.useStateClassSkin) {
          this.toggleMute();
        } else {
          this.mute();
        }
      } else if (this.isMatchedWithSelector(target, this.cssSelector.unmute)) {
        if (this.useStateClassSkin) {
          this.toggleMute();
        } else {
          this.unmute();
        }
      } else if (this.isMatchedWithSelector(target, this.cssSelector.volumeBar) || this.isMatchedWithSelector(target, this.cssSelector.volumeBarValue)) {
        if (this.cssSelector.volumeBar) {
          const volumeSlider = domElement.querySelector(this.cssSelector.volumeBar) as HTMLElement;
          const perc = (e as MouseEvent).offsetX / parseFloat(getComputedStyle(volumeSlider).width);
          this.volume(perc);
        }
      } else if (this.isMatchedWithSelector(target, this.cssSelector.seekBar) || this.isMatchedWithSelector(target, this.cssSelector.playBar)) {
        if (this.cssSelector.seekBar) {
          const seekSlider = domElement.querySelector(this.cssSelector.seekBar) as HTMLElement;
          const perc = (e as MouseEvent).offsetX / parseFloat(getComputedStyle(seekSlider).width);
          this.playHead(perc);
        }
      }
    };
    this.addEventListener(domElement, 'click', clickHandler);
    this.updateVolume();
    this.updateLoopState();
  }
  protected setFullscreenData(state: boolean) {
    if (state) {
      this.container.classList.add(this.stateClass.fullScreen);
      document.querySelector(this.cssSelectorAncestor)?.classList.add(this.stateClass.fullScreen);
    } else {
      this.container.classList.remove(this.stateClass.fullScreen);
      document.querySelector(this.cssSelectorAncestor)?.classList.remove(this.stateClass.fullScreen);
    }
  }
  // Fullscreen
  protected handleFullscreen(enterFullScreen?: boolean) {
    const fullScreenEnabled = isFullScreenEnabled();
    // If the browser doesn't support the Fulscreen API then hide the fullscreen button
    if (!fullScreenEnabled) {
      const btn = document.querySelector(this.cssSelectorAncestor)?.querySelector(this.cssSelector?.fullScreen || '') as HTMLElement;
      btn.style.display = 'none';
      console.warn('Your browser does not support the Fullscreen API.');
      return;
    }
    const enterFullFn = () => {
      requestFullscreen(this.container);
    };
    const exitFullFn = () => {
      exitFullscreen();
    };
    if (typeof enterFullScreen === 'boolean') {
      if (enterFullScreen) {
        enterFullFn();
      } else if (isFullScreen()) {
        exitFullFn();
      }
      return;
    }
    // If fullscreen mode is active...
    if (isFullScreen()) {
      // ...exit fullscreen mode
      exitFullFn();
    } else {
       // ...otherwise enter fullscreen mode
       enterFullFn();
     }
  }
  private updateLoopState() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (this.mediaElement?.loop) {
      domElement.classList.add(this.stateClass.looped);
      if(this.cssSelector.repeat) {
        const repeatBtn = domElement.querySelector(this.cssSelector.repeat);
        if (repeatBtn) {
          repeatBtn.classList.add(this.stateClass?.repeatOne || '');
        }
      }
    } else {
      domElement.classList.remove(this.stateClass.looped);
      if(this.cssSelector.repeat) {
        const repeatBtn = domElement.querySelector(this.cssSelector.repeat);
        if (repeatBtn) {
          repeatBtn.classList.remove(this.stateClass?.repeatOne || '');
        }
      }
    }
  }
  private isMatchedWithSelector(dom, cssSelector): boolean {
    if (!cssSelector) return false;
    do {
      if (matches(dom, cssSelector)) {
        return true;
      }
      dom = dom.parentNode;
    } while (dom !== document.querySelector(this.cssSelectorAncestor) && dom !== document);
    return false;
  }
  private updateVolume() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (this.mediaElement?.muted) {
      domElement.classList.add(this.stateClass.muted);
    } else {
      domElement.classList.remove(this.stateClass.muted);
    }
    if (this.cssSelector.volumeValue) {
      const element = domElement.querySelector(this.cssSelector.volumeValue);
      if (element) {
        element.textContent = String(trunc(this.mediaElement ? this.mediaElement.volume * 100 : 0));
      }
    }
    if (!this.cssSelector.volumeBarValue) return false;
    const ele = domElement.querySelector(this.cssSelector.volumeBarValue) as HTMLElement;
    const val = trunc(this.mediaElement ? this.mediaElement.volume * 100 : 0);
    if (ele) {
      ele!.style.width = this.mediaElement?.muted ? '0%' : val + "%";
    }
  }
}