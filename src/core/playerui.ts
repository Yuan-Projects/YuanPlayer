import Player from "./player";
import { getVideoLevel, showMouseCursor, hideMouseCursor, setActiveCC, getCCList, createTrackElement, isArray, contains, makeLandscape, unlockScreenOrientation, includes, isHtml5AudioSupported, isHtml5VideoSupported, isHLSJSSupported, isHLSNativelySupported, getMediaMimeType, createElement, formatTime, debounce, getFullScreenElement, matches, trunc, uuidv4, isFullScreen, isFullScreenEnabled, exitFullscreen, requestFullscreen } from './utils';
import type { CSSSelector, PlayerStateClass, MediaItem, YuanPlayerOptions } from "./player.d";
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
    closedCaption: ".yuan-closed-caption",
    closedCaptionList: ".yuan-closed-caption-list",
    quality: ".yuan-high-quality",
    qualityList: ".yuan-high-quality-list",
    playrate: ".yuan-playrate",
    playrateList: ".yuan-playrate-list",
    noSolution: ".yuan-no-solution"
  };
  protected stateClass: PlayerStateClass = {
    closedCaption: "yuan-state-closed-caption",
    repeatOne: "yuan-repeat-one",
    playing: "yuan-state-playing",
    seeking: "yuan-state-seeking",
    muted: "yuan-state-muted",
    looped: "yuan-state-looped",
    fullScreen: "yuan-state-full-screen",
    noVolume: "yuan-state-no-volume"
  };
  private fullScreenElement; // Keep a reference to a previous fullscreen element
  private debouncedHide;
  private hlsInstance;
  private cursorTimer;
  protected playbackRates = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2];
  constructor(options: YuanPlayerOptions) {
    super(options);
    // If no valid container exists, we do nothing.
    if(this.container) {
      this.cssSelectorAncestor = options.cssSelectorAncestor || `#yuan_container_${uuidv4()}`;
      this.useStateClassSkin = !!options.useStateClassSkin;
      if (options.playbackRates) {
        this.playbackRates = options.playbackRates;
      }
      this.cssSelector = {
        ...this.cssSelector,
        ...options.cssSelector
      };
      this.stateClass = {
        ...this.stateClass,
        ...options.stateClass
      };
      this.debouncedHide = debounce(() => {
        const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
        if (!domElement) return false;
        domElement.style.display = 'none';
      }, 2000);
      const nativeMediaSupported = (this.isVideo(options.media) && isHtml5VideoSupported()) || (!this.isVideo(options.media) && isHtml5AudioSupported());
      if (!this.nativeControls) {
        // TODO: support native controls
        if (nativeMediaSupported) {
          this.addSyntheticEventListeners();
          this.setMedia(options.media); // `setMedia()` must be called after `this.addSyntheticEventListeners()`
          this.onReady();
          if (this.cssSelectorAncestor && this.mediaElement) {
            const guiHeight = Math.ceil(parseFloat(getComputedStyle(this.container.querySelector(this.cssSelectorAncestor) as HTMLElement).height));
            const parentNode = ((this.mediaElement as HTMLMediaElement).parentNode as HTMLElement);
            if (isFinite(guiHeight) && parentNode) {
              parentNode.style.minHeight = `${guiHeight}px`;
            }
          }
          this.addEventListeners();
          this.updateFullScreenButton();
        }
      }
      if (!nativeMediaSupported) {
        const element = document.querySelector(`${this.cssSelectorAncestor} ${this.cssSelector.noSolution}`) as HTMLElement;
        if (element) {
          element.style.display = 'block';
        }
      }
    }
  }
  protected abstract onReady();
  protected abstract onShowQualityList();
  protected abstract onShowClosedCaptionList();
  protected abstract onShowPlayrateList();
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

    this.addEventListener(media, 'mousemove', this.handleVideoMouseMove);
    this.addEventListener(media, 'click', this.handleClickMedia);
    this.addEventListener(media, 'touchstart', this.handleVideoTouch);
    this.addEventListener(media, 'playing', this.handlePlaying);
  }
  private handlePlaying = (e) => {
    const target = e.target;
    if (target.tagName !== 'VIDEO') return false;
    hideMouseCursor();
    this.debouncedHide();
  }
  private handleVideoTouch = (e) => {
    e.preventDefault();
    const target = e.target;
    if (target.tagName !== 'VIDEO') return false;
    // show the controls
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (domElement && domElement.style.display !== 'block') {
      domElement.style.display = 'block';
    }
    if (this.isPlaying() === false) {
      clearTimeout(this.debouncedHide.timer());
    } else {
      hideMouseCursor();
      this.debouncedHide();
    }
  }
  private handleClickMedia = (e) => {
    const target = e.target;
    if (target.tagName !== 'VIDEO') return false;
    this.togglePlay();
    this.hideGUIPopups();
    if (this.isPlaying() === false) {
      // show the controls and will not hide them automatically
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (domElement && domElement.style.display !== 'block') {
        domElement.style.display = 'block';
      }
      showMouseCursor(this.cursorTimer);
      clearTimeout(this.debouncedHide.timer());
    } else {
      hideMouseCursor();
      this.debouncedHide();
    }
  }
  /**
   * Create a div which contains the `<audio>` or `<video>` element.
   * @returns A div which container the `<audio>` or `<video>` element.
   */
  protected addMediaElement() {
    const div = createElement('div');
    const mediaElement = this.addMediaElementTag();

    this.addMediaSource();
    this.setMediaPoster();
    this.addTextTracks();

    div.appendChild(mediaElement);
    this.container.insertAdjacentElement('afterbegin', div);
  }
  protected setMediaPoster() {
    if (!this.mediaElement) return false;
    if (!this.media?.poster || this.mediaElement.tagName !== 'VIDEO') {
      this.mediaElement.removeAttribute('poster');
    } else {
      (this.mediaElement as HTMLVideoElement).poster = this.media.poster;
    }
  }
  /**
   * Update the `<audio>` or `<video>` element's `<source>` elements.
   * It will remove existing `<source>` tags if any.
   */
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
  protected addTextTracks() {
    if (!this.media || isArray(this.media.tracks) === false || !this.mediaElement) return false;
    this.media.tracks?.forEach((track) => {
      this.mediaElement?.appendChild(createTrackElement(track));
    });
  }
  /**
   * Create a `<source>` element and append it to the `<audio>` or `<video>` element.
   * @param src - The media file URL
   * @param isVideo - If it's a video file
   */
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
    //if (fileExtension === 'm3u8') {
      if (isHLSJSSupported()) {
        const hlsInstance = new Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(this.mediaElement);
        this.hlsInstance = hlsInstance;
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
      playsinline: true,
      style: "width: 100%; display: block;"
    };
    if (this.media?.poster) {
      videoAttrs.poster = this.media.poster;
    }
    const mediaElement = (this.media && this.isVideo(this.media) ? createElement('video', videoAttrs) : createElement('audio', attrs)) as HTMLMediaElement;
    this.mediaElement = mediaElement;
    return mediaElement;
  }

  /**
   * Determine if current track is a video.
   * @param media - The media object
   * @returns boolean
   */
  protected isVideo(media: MediaItem | null): boolean {
    if (!media) return false;
    if (typeof media.isVideo === 'boolean') return media.isVideo;
    const src = media.src;
    if (!src) return false;
    // .ogg, mp4 can be used as both video and audio
    const videoExts = ['ogm', 'ogv', 'webm', 'mp4', 'm4v'];
    const srcs = typeof src === 'string' ? [src] : src.slice(0);
    for (let i = 0; i < srcs.length; i++) {
      const ext = srcs[i].split('.').pop();
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
      if (!this.stateClass.playing) return ;
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      domElement?.classList.remove(this.stateClass.playing);
    });
    this.on('durationchange', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!this.cssSelector.duration) return false;
      const element = domElement?.querySelector(this.cssSelector.duration);
      if (element) {
        element.textContent = formatTime(this.mediaElement && isFinite(this.mediaElement.duration) ? Math.floor(this.mediaElement.duration) : 0);
      }
    });
    this.on('setmedia', () => {
      const expectedTag = this.media && this.isVideo(this.media) ? 'video' : 'audio';
      if (!this.mediaElement) { // The media element has not been created
        this.addMediaElement();
        this.bindMediaEvents();
      } else {
        if (this.hlsInstance) {
          this.hlsInstance.detachMedia();
          this.hlsInstance.destroy();
        }
        // If the new media file has a different tag name, remove the existing tag, remove its event handlers,
        // Then create a new tag and add events listeners again.
        // We need to the same thing if a hls.js instance has attached to the media element,
        // because hlj.js uses `addTextTrack` to create text tracks, which cannot be removed, there's no `removeTextTrack` in HTMLVideoElement spec.
        // See https://github.com/video-dev/hls.js/issues/2198
        if (this.mediaElement.tagName.toLowerCase() !== expectedTag || this.hlsInstance) {
          const div = this.mediaElement.parentNode as Element;
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
          this.hlsInstance = null;

          // add new tag
          const mediaElement = this.addMediaElementTag();
          div.insertAdjacentElement('afterbegin', mediaElement);

          this.bindMediaEvents();
        }
        // Update `<source>` elements and load the media file
        this.addMediaSource();
        this.setMediaPoster();
        this.addTextTracks();
        this.mediaElement?.load();
      }
    });
    this.on('setmedia', this.updateFullScreenButton);
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
      // show the controls and will not hide them automatically
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (domElement && domElement.style.display !== 'block') {
        domElement.style.display = 'block';
      }
      showMouseCursor(this.cursorTimer);
      clearTimeout(this.debouncedHide.timer());
      this.updateVolume();
      this.updateLoopState();
      setTimeout(() => {
        this.updateCCButton();
        this.updateQualityButton();
        this.updatePlaybackRateButton();
      });
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
      if (!domElement || !this.stateClass.playing) return;
      // If current src is empty, we should not add the state class
      if (this.mediaElement?.currentSrc) {
        domElement.classList.add(this.stateClass.playing);
      }
    });
    this.on('pause', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement || !this.stateClass.playing) return;
      domElement.classList.remove(this.stateClass.playing);
      // show the controls
      domElement.style.display = 'block';
      clearTimeout(this.debouncedHide.timer());
    });
    this.on('stop', () => {
      const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
      if (!domElement) return;
      if (this.stateClass.playing) {
        domElement.classList.remove(this.stateClass.playing);
      }
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
      if (this.stateClass.playing) {
        domElement?.classList.remove(this.stateClass.playing);
      }
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
  protected updateFullScreenButton = () => {
    if (!this.cssSelector?.fullScreen) return false;
    const fullScreenBtn = this.container?.querySelector(this.cssSelector?.fullScreen) as HTMLElement;
    if (!fullScreenBtn || !isFullScreenEnabled()) return;
    if (this.media && this.isVideo(this.media)) {
      fullScreenBtn.style.display = 'inline-block';
    } else {
      fullScreenBtn.style.display = 'none';
    }
  }
  private handleGUIClick = (e) => {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
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
      if (this.stateClass.looped) {
        domElement.classList.toggle(this.stateClass.looped);
      }
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
    } else if (this.isMatchedWithSelector(target, this.cssSelector.quality)) {
      this.hideGUIPopups();
      this.onShowQualityList();
      this.showGUIControls();
    } else if (this.isMatchedWithSelector(target, this.cssSelector.closedCaption)) {
      this.hideGUIPopups();
      this.onShowClosedCaptionList();
      this.showGUIControls();
    } else if (this.isMatchedWithSelector(target, this.cssSelector.playrate)) {
      this.hideGUIPopups();
      this.onShowPlayrateList();
      this.showGUIControls();
    } else {
      this.hideGUIPopups();
      this.hideGUIControls();
    }
  }
  private fullscreenchangeFn = () => {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    const isFullScreenMode = isFullScreen();
    const fullScreenElement = getFullScreenElement();
    const restoreGUI = (scrollIntoView: boolean = false) => {
      domElement.style.display = 'block';
      (this.mediaElement as HTMLElement).style.position = 'static';
      (this.mediaElement as HTMLElement).style.height = 'auto';
      (this.mediaElement as HTMLElement).style.left = 'auto';
      (this.mediaElement as HTMLElement).style.top = 'auto';
      clearTimeout(this.debouncedHide.timer());
      this.removeEventListener(domElement, 'mouseenter', this.fullScreenGUIHandler);
      this.removeEventListener(domElement, 'mouseleave', this.hideCssAncestor);
      if (scrollIntoView) {
        this.mediaElement?.scrollIntoView();
      }
    };
    const bindFullScreenListeners = () => {
      domElement.style.display = 'none';
      (this.mediaElement as HTMLElement).style.position = 'fixed';
      (this.mediaElement as HTMLElement).style.height = '100%';
      (this.mediaElement as HTMLElement).style.left = '0';
      (this.mediaElement as HTMLElement).style.top = '0';
      this.addEventListener(domElement, 'mouseenter', this.fullScreenGUIHandler);
      this.addEventListener(domElement, 'mouseleave', this.hideCssAncestor);
      hideMouseCursor();
    };
    if (isFullScreenMode) { // enter fullscreen
      this.fullScreenElement = fullScreenElement;
      // if the fullscreenchange is not triggered by current player
      // we restore the GUI of current player
      if (contains(this.container, fullScreenElement) === false) {
        restoreGUI(false);
        this.setFullscreenData(false);
        return false;
      } else {
        bindFullScreenListeners();
        this.setFullscreenData(true);
        return false;
      }
    } else { // exit fullscreen
      if (contains(this.container, this.fullScreenElement)) {
        restoreGUI(true);
        this.setFullscreenData(false);
        showMouseCursor(this.cursorTimer);
      }
      this.fullScreenElement = null;
    }
  }
  private handleVideoMouseMove = () => {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (domElement.style.display !== 'block') {
      domElement.style.display = 'block';
    }
    // restore cursor
    showMouseCursor(this.cursorTimer);
    if (this.isPlaying() === false) {
      return false;
    }
    this.debouncedHide();
    // goto sleep after a few moments
    this.cursorTimer = setTimeout(() => {
      if (contains(this.container, getFullScreenElement())) {
        hideMouseCursor();
      }
    }, 2000);
  }
  private fullScreenGUIHandler = () => {
    showMouseCursor(this.cursorTimer);
    clearTimeout(this.debouncedHide.timer());
  }
  protected showGUIControls = () => {
    showMouseCursor(this.cursorTimer);
    clearTimeout(this.debouncedHide.timer());
  }
  protected hideGUIControls = () => {
    if (this.mediaElement?.tagName.toLowerCase() === 'video' && this.isPlaying()) {
      this.debouncedHide();
    }
  }
  private hideCssAncestor = () => {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    domElement.style.display = 'none';
    // // goto sleep after a few moments
    this.cursorTimer = setTimeout(hideMouseCursor, 2000);
  }
  private addEventListeners() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (isFullScreenEnabled()) {
      this.addEventListener(document, 'fullscreenchange', this.fullscreenchangeFn);
      this.addEventListener(document, 'webkitfullscreenchange', this.fullscreenchangeFn);
      this.addEventListener(document, 'mozfullscreenchange', this.fullscreenchangeFn);
      this.addEventListener(document, 'msfullscreenchange', this.fullscreenchangeFn);
      this.addEventListener(document, 'MSFullscreenChange', this.fullscreenchangeFn);
    }
    this.addEventListener(domElement, 'click', this.handleGUIClick);
    this.addEventListener(document, 'keydown', this.handleKeyboardEvents);
    this.addEventListener(document, 'scroll', this.handleDocumentScroll);
    if (screen.orientation) {
      this.addEventListener(screen.orientation, 'change', this.orientationChangeFn);
    }
    this.updateVolume();
    this.updateLoopState();
    this.updateCCButton();
    this.updateQualityButton();
    this.updatePlaybackRateButton();
  }
  private orientationChangeFn = (e) => {
    if (this.isVideo(this.media) === false) return;
    if (this.isPlaying()) {
      hideMouseCursor();
      this.debouncedHide();
    }
  }
  private handleDocumentScroll = (e) => {
    showMouseCursor(this.cursorTimer);
  }
  private handleKeyboardEvents = (e) => {
    if (this.mediaElement?.tagName !== 'VIDEO' || isFinite(this.mediaElement?.currentTime) === false || isFinite(this.mediaElement.duration) === false) return false;
    if (e.key === ' ' || e.keyCode === 32) {
      this.togglePlay();
    } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
      if (this.mediaElement?.currentTime + 10 < this.mediaElement.duration) {
        this.mediaElement.currentTime += 10;
      }
    } else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
      if (this.mediaElement?.currentTime - 10 > 0) {
        this.mediaElement.currentTime -= 10;
      }
    }
  }
  protected setFullscreenData(state: boolean) {
    if (!this.stateClass.fullScreen) return;
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
      const btn = document.querySelector(this.cssSelectorAncestor + ' ' + this.cssSelector?.fullScreen);
      if (btn) {
        (btn as HTMLElement).style.display = 'none';
      }
      console.warn('Your browser does not support the Fullscreen API.');
      return;
    }
    if (typeof enterFullScreen === 'boolean') {
      if (enterFullScreen) {
        requestFullscreen(this.container);
        makeLandscape();
      } else if (isFullScreen()) {
        exitFullscreen();
        unlockScreenOrientation();
      }
      return;
    }
    if (isFullScreen()) {
      exitFullscreen();
      unlockScreenOrientation();
    } else {
      requestFullscreen(this.container);
      makeLandscape();
    }
  }
  private updateLoopState() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (this.stateClass.looped) {
      if (this.mediaElement?.loop) {
        domElement.classList.add(this.stateClass.looped);
      } else {
        domElement.classList.remove(this.stateClass.looped);
      }
    }
    if(this.cssSelector.repeat) {
      const repeatBtn = domElement.querySelector(this.cssSelector.repeat);
      if (repeatBtn && this.stateClass?.repeatOne) {
        if (this.mediaElement?.loop) {
          repeatBtn.classList.add(this.stateClass.repeatOne);
        } else {
          repeatBtn.classList.remove(this.stateClass.repeatOne);
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
    } while (dom && dom !== document.querySelector(this.cssSelectorAncestor) && dom !== document);
    return false;
  }
  protected updateVolume() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (this.stateClass.muted) {
      if (this.mediaElement?.muted) {
        domElement.classList.add(this.stateClass.muted);
      } else {
        domElement.classList.remove(this.stateClass.muted);
      }
    }
    if (this.cssSelector.volumeValue) {
      const element = domElement.querySelector(this.cssSelector.volumeValue) as HTMLElement;
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
  protected setActiveCC(value: string) {
    setActiveCC(this.mediaElement, value);
  }
  protected getCCList() {
    return getCCList(this.mediaElement as HTMLVideoElement);
  }
  protected updateCCButton() {
    if (!this.cssSelector.closedCaption) return;
    const element = this.container.querySelector(this.cssSelectorAncestor + ' ' + this.cssSelector.closedCaption) as HTMLElement;
    if (!element) return;
    if (!this.mediaElement || this.mediaElement?.tagName !== "VIDEO") {
      element.style.display = 'none';
    } else {
      const ccList = this.getCCList();
      if (ccList.length < 2) { // No .vtt files provided or not supported by current browser
        element.style.display = 'none';
      } else {
        element.style.display = 'inline-block';
        if (this.stateClass.closedCaption) {
          if (ccList[0].checked === true) { // CC is turned off
            this.container.classList.remove(this.stateClass.closedCaption);
            this.container.querySelector(this.cssSelectorAncestor)?.classList.remove(this.stateClass.closedCaption);
          } else {
            this.container.classList.add(this.stateClass.closedCaption);
            this.container.querySelector(this.cssSelectorAncestor)?.classList.add(this.stateClass.closedCaption);
          }
        }
      }
    }
  }
  protected updateQualityButton() {
    if (!this.cssSelector.quality) return;
    const element = this.container.querySelector(this.cssSelectorAncestor + ' ' + this.cssSelector.quality) as HTMLElement;
    if (!element) return;
    if (!this.mediaElement || this.mediaElement?.tagName !== "VIDEO") {
      element.style.display = 'none';
    } else {
      element.style.display = 'inline-block';
    }
  }
  protected updatePlaybackRateButton() {
    if (!this.cssSelector.playrate) return;
    const element = this.container.querySelector(this.cssSelectorAncestor + ' ' + this.cssSelector.playrate) as HTMLElement;
    if (!element) return;
    if (!this.mediaElement || this.mediaElement?.tagName !== "VIDEO") {
      element.style.display = 'none';
    } else {
      element.style.display = 'inline-block';
    }
  }
  protected setHLSQuality(value: number = -1) {
    if (!this.hlsInstance) return false;
    this.hlsInstance.currentLevel = value;
  }
  protected getQualityList() {
    const list: any = [];
    if (this.hlsInstance?.levels) {
      this.hlsInstance?.levels.forEach((level, index) => {
        list.push({
          label: `${level.name || getVideoLevel(isArray(level._attrs) ? level._attrs[0]?.RESOLUTION : '')}P`,
          checked: index === this.hlsInstance.currentLevel
        });
      });
    } else {
      list.push({
        label: 'Auto',
        checked: true
      });
    }
    return list;
  }
  protected getPlayrateList() {
    return this.playbackRates;
  }
  protected hideGUIPopups() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (this.cssSelector.closedCaptionList) {
      const element = domElement.querySelector(this.cssSelector.closedCaptionList) as HTMLElement;
      if (element) {
        element.innerHTML = '';
      }
    }
    if (this.cssSelector.qualityList) {
      const element = domElement.querySelector(this.cssSelector.qualityList) as HTMLElement;
      if (element) {
        element.innerHTML = '';
      }
    }
    if (this.cssSelector.playrateList) {
      const element = domElement.querySelector(this.cssSelector.playrateList) as HTMLElement;
      if (element) {
        element.innerHTML = '';
      }
    }
  }
}