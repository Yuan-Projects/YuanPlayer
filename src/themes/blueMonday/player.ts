import { YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import playerTpl from './player.ejs';
import './index.css';

function getClass(Base) {
  return class YuanPlayer extends Base {
    constructor(options: YuanPlayerOptions) {
      super(options);
      if (this.controls === 'default') {
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

      this.on('play', () => {
        audioContainer?.classList.add('jp-state-playing');
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
      });
    }
  }
}

export default getClass;