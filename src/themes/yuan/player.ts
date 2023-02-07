import Lottie from 'lottie-web/build/player/esm/lottie.min.js';
import { YuanPlayerOptions } from '../../core/player.d';
import './player.scss';

function getClass(Base) {
  return class YuanPlayer extends Base {
    constructor(options: YuanPlayerOptions) {
      super(options);
      if (this.controls === 'default') {
        this.renderPlayerUI();
      }
    }
  
    renderPlayerUI() {
      const row1 = document.createElement('div');
      row1.classList.add('controls-row')
      const row2 = document.createElement('div');
      row2.classList.add('controls-row')
  
      // Play/Pause button
      const playButton = document.createElement('button');
      playButton.classList.add('yuan-player-play-icon');
  
      const animation = Lottie.loadAnimation({
        container: playButton,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Demo Animation",
      });
  
      animation.goToAndStop(14, true);
  
      row1.appendChild(playButton);
  
      this.on('ended', () => {
        // Show play button again
        animation.playSegments([0, 14], true);
      });
      this.on('play', () => {
        animation.playSegments([14, 27], true);
      })
  
      playButton.addEventListener('click', () => {
        if (this.mediaObject.paused) {
          animation.playSegments([14, 27], true);
          this.mediaObject.play();
        } else {
          animation.playSegments([0, 14], true);
          this.mediaObject.pause();
        }
      });
  
      // Current time and duration
  
      const currentTimeElement = document.createElement('span');
      currentTimeElement.classList.add('time');
      currentTimeElement.textContent = '0:00';
      row1.appendChild(currentTimeElement);
  
      this.on('timeupdate', () => {
        const second = Math.floor(this.mediaObject.currentTime);
        currentTimeElement.textContent = this.formatTime(second);
        seekSlider.value = String(second / this.mediaObject.duration * 100);
      });
  
      const seekSlider = document.createElement('input');
      seekSlider.type = 'range';
      seekSlider.max = '100';
      seekSlider.value = '0';
      seekSlider.classList.add('seek-slider');
      row1.appendChild(seekSlider);
  
      seekSlider.addEventListener('change', () => {
        // @ts-ignore
        this.mediaObject.currentTime = parseFloat(seekSlider.value * this.mediaObject.duration / 100);
      });
  
  
      const durationElement = document.createElement('span');
      durationElement.classList.add('time');
      durationElement.textContent = '0:00';
      row1.appendChild(durationElement);
  
      this.on('durationchange', () => {
        durationElement.textContent = this.formatTime(Math.floor(this.mediaObject.duration));
      });
  
      const volumeOutput = document.createElement('output');
      volumeOutput.textContent = String(this.mediaObject.volume * 100); // '100';
      row2.appendChild(volumeOutput);
  
      const volumeSlider = document.createElement('input');
      volumeSlider.type = 'range';
      volumeSlider.max = '100';
      volumeSlider.value = String(this.mediaObject.volume * 100); //'0';
      volumeSlider.classList.add('volume-slider');
      row2.appendChild(volumeSlider);
  
      volumeSlider.addEventListener('input', () => {
        const value = volumeSlider.value;
        const newVolume = parseFloat(value) / 100;
        this.mediaObject.volume = newVolume;
        volumeOutput.textContent = String(parseInt(value));
      });
  
      // TODO
      this.on('volumechange', () => {
        console.log('volumechange:', this.mediaObject.volume)
      })
  
      const muteButton = document.createElement('button');
      muteButton.classList.add('mute-icon');
      const muteAnimation = Lottie.loadAnimation({
        container: muteButton,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Mute Animation",
      });
      muteButton.addEventListener('click',  () => {
        if (this.mediaObject.muted) {
          this.unmute();
          muteAnimation.playSegments([15, 25], true);
        } else {
          this.mute();
          muteAnimation.playSegments([0, 15], true);
        }
      });
      row2.appendChild(muteButton);
  
      const divContainer = this.container.querySelector('.yuan-player-container');
      divContainer.appendChild(row1);
      divContainer.appendChild(row2);
    }
  }
}

export default getClass;