// imports the Lottie library 
import Lottie from 'lottie-web/build/player/esm/lottie.min.js';
// @ts-ignore
import playerTpl from './player.ejs';
import { YuanPlayerOptions } from '../../core/player.d';
import './player.scss';

function getClass(Base) {
  return class YuanPlayer extends Base {
    constructor(options: YuanPlayerOptions) {
      super(options);
      // previous muted state
      this.muted = false;
      if (!this.nativeControls) {
        this.renderPlayerUI();
      }
    }
  
    renderPlayerUI() {
      const div = document.createElement('div');
      div.innerHTML = playerTpl();
      this.container.appendChild(div);

      // Play/Pause button
      // variable for the button that will contain both icons
      const playIconContainer = div.querySelector('.play-icon');
  
      // loads the animation that transitions the play icon into the pause icon into the referenced button, using Lottie’s loadAnimation() method
      // [0, 14] => play icon
      // [14, 27] => pause icon
      const animation = Lottie.loadAnimation({
        container: playIconContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Demo Animation",
      });
      animation.goToAndStop(14, true);
      // adds an event listener to the button so that when it is clicked, the the player toggles between play and pause
      playIconContainer?.addEventListener('click', () => {
        if (this.mediaObject.paused) {
          this.mediaObject.play();
        } else {
          this.mediaObject.pause();
        }
      });

      this.on('ended', () => {
        // Show play button again
        animation.playSegments([0, 14], true);
      });
      this.on('pause', () => {
        animation.playSegments([0, 14], true);
      });
      this.on('play', () => {
        animation.playSegments([14, 27], true);
      });

      // Current time and duration
      const currentTimeElement = div.querySelector('.current-time');
      currentTimeElement!.textContent = this.formatTime(Math.floor(this.mediaObject.currentTime));

      const durationChangeHandler = () => {
        this.displayAudioDuration();
        this.setSliderMax();
      };
      this.on('durationchange', durationChangeHandler);
      this.on('loadedmetadata', durationChangeHandler);

      this.on('timeupdate', () => {
        const second = Math.floor(this.mediaObject.currentTime);
        currentTimeElement!.textContent = this.formatTime(second);
        this.setSliderValue();
      });

      const seekSlider = div.querySelector('.seek-slider') as HTMLInputElement;

      seekSlider?.addEventListener('input', () => {
        this.mediaObject.currentTime = parseInt(seekSlider.value);
      });

      this.setVolumeOutput();

      const volumeSlider = div.querySelector('.volume-slider');
      this.setVolumeSlider();
      volumeSlider?.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.mediaObject.volume = (parseFloat(value) / 100);
      });

      const muteIconContainer = div.querySelector('.mute-icon');
      muteIconContainer?.classList.add('mute-icon');
      this.muteAnimation = Lottie.loadAnimation({
        container: muteIconContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Mute Animation",
      });
      muteIconContainer?.addEventListener('click',  () => {
        this.toggleMute();
      });

      this.on('volumechange', () => {
        this.setVolumeOutput();
        this.setVolumeSlider();
        if (this.mediaObject.muted !== this.muted) {
          this.setVolumeIcon();
        }
        this.muted = this.mediaObject.muted;
      });
    }
    displayAudioDuration() {
      const durationElement = this.container.querySelector('.duration');
      durationElement!.textContent = this.formatTime(Math.floor(this.mediaObject.duration));
    }
    setSliderMax() {
      const seekSlider = this.container.querySelector('.seek-slider');
      seekSlider.max = Math.floor(this.mediaObject.duration);
    }
    setSliderValue() {
      const seekSlider = this.container.querySelector('.seek-slider');
      seekSlider.value = Math.floor(this.mediaObject.currentTime);
      this.container.querySelector('.yuanplayer-yuan-container').style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    }
    setVolumeOutput() {
      const volumeOutput = this.container.querySelector('.volume-out')
      volumeOutput.textContent = String(Math.trunc(this.mediaObject.volume * 100));
    }
    setVolumeSlider() {
      const volumeSlider = this.container.querySelector('.volume-slider');
      volumeSlider.value = String(this.mediaObject.volume * 100); //'0';
    }
    setVolumeIcon() {
      if (this.mediaObject.muted) {
        this.muteAnimation.playSegments([0, 15], true);
      } else {
        this.muteAnimation.playSegments([15, 25], true);
      }
    }
  }
}

export default getClass;