// imports the Lottie library 
import Lottie from 'lottie-web/build/player/esm/lottie.min.js';
import { uuidv4 } from '../../core/utils';
// @ts-ignore
import playerTpl from './player.ejs';
import { YuanPlayerOptions } from '../../core/player.d';
import './player.scss';

function getClass(Base) {
  return class YuanPlayer extends Base {
    cssSelectorAncestor = '';
    constructor(options: YuanPlayerOptions) {
      options.useStateClassSkin = true;
      options.cssSelectorAncestor = `#yuan_container_${uuidv4()}`;
      options.cssSelector = {
        mute: '.mute-icon',
        volumeValue: '.volume-out',
        play: '.play-icon',
        currentTime: '.current-time',
        duration: '.duration',
        ...options.cssSelector
      }
      super(options);
      this.cssSelectorAncestor = options.cssSelectorAncestor;
      // previous muted state
      this.muted = false;
      if (!this.nativeControls) {
        this.renderPlayerUI();
      }
    }
  
    renderPlayerUI() {
      const div = document.createElement('div');
      div.id = this.cssSelectorAncestor.substring(1);
      div.classList.add('yuanplayer-yuan-player');
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

      const durationChangeHandler = () => {
        this.setSliderMax();
      };
      this.on('durationchange', durationChangeHandler);
      this.on('loadedmetadata', durationChangeHandler);

      this.on('timeupdate', () => {
        this.setSliderValue();
      });

      const seekSlider = div.querySelector('.seek-slider') as HTMLInputElement;

      seekSlider?.addEventListener('input', () => {
        this.mediaObject.currentTime = parseInt(seekSlider.value);
      });

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

      this.on('volumechange', () => {
        this.setVolumeSlider();
        if (this.mediaObject.muted !== this.muted) {
          this.setVolumeIcon();
        }
        this.muted = this.mediaObject.muted;
      });

      this.on('stop', () => {
        // Show play button again
        animation.playSegments([0, 14], true);
      });
    }
    setSliderMax() {
      const seekSlider = document.querySelector(this.cssSelectorAncestor)!.querySelector('.seek-slider') as HTMLInputElement;
      if (seekSlider) {
        seekSlider.max = String(Math.floor(this.mediaObject.duration));
      }
    }
    setSliderValue() {
      const seekSlider = this.container.querySelector('.seek-slider');
      seekSlider.value = Math.floor(this.mediaObject.currentTime);
      this.container.querySelector('.yuanplayer-yuan-container').style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
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