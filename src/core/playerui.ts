import Player from "./player";
import { uuidv4 } from './utils';
import type { CSSSelector, YuanPlayerOptions } from "./player.d";

export default class PlayerUI extends Player {
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
    playing: "yuan-state-playing",
    seeking: "yuan-state-seeking",
    muted: "yuan-state-muted",
    looped: "yuan-state-looped",
    fullScreen: "yuan-state-full-screen",
    noVolume: "yuan-state-no-volume"
  };
  constructor(options: YuanPlayerOptions) {
    super(options);
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
    if (!this.nativeControls) {
      this.addEventListeners();
    }
  }
  private addEventListeners() {
    setTimeout(() => {
      const domElement = document.querySelector(this.cssSelectorAncestor);
      if (!domElement) return false;
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
      domElement.addEventListener('click', clickHandler, false);
      this.on('durationchange', () => {
        if (!this.cssSelector.duration) return false;
        const element = domElement.querySelector(this.cssSelector.duration);
        if (element) {
          element.textContent = this.formatTime(Math.floor(this.mediaObject.duration));
        }
      });
      this.on('setmedia', () => {
        if (!this.cssSelector.title) return false;
        const element = domElement.querySelector(this.cssSelector.title);
        if (element) {
          element.textContent = this.media.title || '';
        }
      })
      this.on('timeupdate', () => {
        const second = Math.floor(this.mediaObject.currentTime);
        if (this.cssSelector.currentTime) {
          domElement.querySelector(this.cssSelector.currentTime)!.textContent = this.formatTime(second);
        }
        if (this.cssSelector.playBar) {
          const element = (domElement.querySelector(this.cssSelector.playBar) as HTMLElement);
          if (element) {
            const perc = isFinite(this.mediaObject.duration) ? this.mediaObject.currentTime / this.mediaObject.duration : 0;
            element.style.width = `${perc * 100}%`;
          }
        }
      });
      this.on('play', () => {
        domElement.classList.add(this.stateClass.playing);
      });
      this.on('pause', () => {
        domElement.classList.remove(this.stateClass.playing);
      });
      this.on('stop', () => {
        domElement.classList.remove(this.stateClass.playing);
      });
      this.on('clearmedia', () => {
        domElement?.classList.remove(this.stateClass.playing);
        if (this.cssSelector.duration) {
          domElement.querySelector(this.cssSelector.duration)!.textContent = this.formatTime(0);
        }
        if (this.cssSelector.playBar) {
          (domElement.querySelector(this.cssSelector.playBar) as HTMLElement).style.width = `0%`;
        }
      });
      this.on('volumechange', () => {
        this.updateVolume();
      });
      this.updateVolume();
    }, 0);
  }
  private isMatchedWithSelector(dom, cssSelector, rootElement = this.container): boolean {
    if (!cssSelector) return false;
    do {
      if (dom.matches(cssSelector)) {
        return true;
      }
      dom = dom.parentNode;
    } while (dom !== document.querySelector(this.cssSelectorAncestor) && dom !== document);
    return false;
  }
  updateVolume() {
    const domElement = document.querySelector(this.cssSelectorAncestor) as HTMLElement;
    if (!domElement) return false;
    if (this.mediaObject.muted) {
      domElement.classList.add(this.stateClass.muted);
    } else {
      domElement.classList.remove(this.stateClass.muted);
    }
    if (this.cssSelector.volumeValue) {
      const element = domElement.querySelector(this.cssSelector.volumeValue);
      if (element) {
        element.textContent = String(Math.trunc(this.mediaObject.volume * 100));
      }
    }
    if (!this.cssSelector.volumeBarValue) return false;
    const ele = domElement.querySelector(this.cssSelector.volumeBarValue) as HTMLElement;
    const val = Math.trunc(this.mediaObject.volume * 100);
    if (ele) {
      ele!.style.width = this.mediaObject.muted ? '0%' : val + "%";
    }
  }
};