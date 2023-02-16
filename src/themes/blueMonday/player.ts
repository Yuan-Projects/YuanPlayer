import type { YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import playerTpl from './player.ejs';
import './index.css';

function getClass(Base) {
  return class YuanPlayer extends Base {
    constructor(options: YuanPlayerOptions) {
      super(options);
      if (!this.nativeControls) {
        this.renderPlayerUI();
      }
    }
  
    renderPlayerUI() {
      const div = document.createElement('div');
      div.innerHTML = playerTpl();
      this.container.appendChild(div);

      const playButton = div.querySelector('.jp-play');
      playButton?.addEventListener('click', () => {
        this.togglePlay();
      });

      const stopButton = div.querySelector('.jp-stop');
      stopButton?.addEventListener('click', () => {
        this.stop();
      });

      const currentTimeElement = div.querySelector('.jp-current-time');
      const durationElement = div.querySelector('.jp-duration');
      const audioContainer = div.querySelector('.jp-audio');
      const seekSlider = div.querySelector('.jp-seek-bar');
      const volumeSlider = div.querySelector('.jp-volume-bar');
      const muteButton = div.querySelector('.jp-mute');
      const volumeMaxButton = div.querySelector('.jp-volume-max');

      volumeMaxButton?.addEventListener('click', () => {
        this.mediaObject.volume = 1;
        this.unmute();
      });
      muteButton?.addEventListener('click', () => {
        this.toggleMute();
      });

      volumeSlider?.addEventListener('click', (e) => {
        const perc = (e as MouseEvent).offsetX / parseFloat(getComputedStyle(volumeSlider).width);
        this.mediaObject.volume = perc;
      });

      seekSlider?.addEventListener('click', (e) => {
        const perc = (e as MouseEvent).offsetX / parseFloat(getComputedStyle(seekSlider).width);
        this.mediaObject.currentTime = this.mediaObject.duration * perc;
      });

      this.on('play', () => {
        audioContainer?.classList.add('jp-state-playing');
      });
      this.on('clearmedia', () => {
        audioContainer?.classList.remove('jp-state-playing');
        durationElement!.textContent = this.formatTime(Math.floor(0));
        this.container.querySelector('.jp-play-bar').style.width = `0%`;
      });
      this.on('pause', () => {
        audioContainer?.classList.remove('jp-state-playing');
      });

      this.on('durationchange', () => {
        if (durationElement) {
          durationElement.textContent = this.formatTime(Math.floor(this.mediaObject.duration));
        }
      });
      this.on('timeupdate', () => {
        const second = Math.floor(this.mediaObject.currentTime);
        if (currentTimeElement) {
          currentTimeElement.textContent = this.formatTime(second);
        }
        this.container.querySelector('.jp-play-bar').style.width = `${this.mediaObject.currentTime / this.mediaObject.duration * 100}%`;
      });
      this.on('volumechange', () => {
        this.updateVolume();
      });
      this.updateVolume();
    }
    updateVolume() {
      const audioContainer = this.container.querySelector('.jp-audio');
      if (this.mediaObject.muted) {
        audioContainer.classList.add('jp-state-muted');
      } else {
        audioContainer.classList.remove('jp-state-muted');
      }
      const ele = this.container.querySelector('.jp-volume-bar-value');
      const val = Math.trunc(this.mediaObject.volume * 100);
      ele.style.width = this.mediaObject.muted ? '0%' : val + "%";
    }
  }
}

export default getClass;