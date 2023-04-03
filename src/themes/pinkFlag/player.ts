import type { YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import controlGUITpl from './player-gui.ejs';
import { merge, uuidv4 } from '../../core/utils';
import './index.scss';

function getClass(Base) {
  return class YuanPlayer extends Base {
    options;
    constructor(options: YuanPlayerOptions) {
      options.useStateClassSkin = true;
      const defaultOptions = {
        useStateClassSkin: true,
        nativeControls: false,
        cssSelectorAncestor: `#yuan_container_${uuidv4()}`,
        cssSelector: {
          play: '.jp-play',
          stop: '.jp-stop',
          currentTime: '.jp-current-time',
          duration: '.jp-duration',
          seekBar: '.jp-seek-bar',
          playBar: '.jp-play-bar',
          mute: '.jp-mute',
          volumeMax: '.jp-volume-max',
          volumeBar: '.jp-volume-bar',
          volumeBarValue: '.jp-volume-bar-value',
          repeat: '.jp-repeat',
          title: '.jp-title',
          fullScreen: '.jp-full-screen',
        },
        stateClass: {
          seeking: 'jp-seeking-bg',
          fullScreen: 'jp-state-full-screen',
          playing: 'jp-state-playing',
          muted: 'jp-state-muted',
          looped: "jp-state-looped",
        }
      }
      const mergedOptions = merge(defaultOptions, options)
      super(mergedOptions);
    }
  
    protected onReady() {
      const guiDiv = document.createElement('div');
      guiDiv.id = this.cssSelectorAncestor.substring(1);
      guiDiv.classList.add('yuanplayer-pinkflag-player');
      guiDiv.innerHTML = controlGUITpl();
      this.mediaElement.parentNode.appendChild(guiDiv);
      this.mediaElement.parentNode.style.position = 'relative';

      // If current browser support flex wrapping, use flexbox layout
      // Some old browsers does not support this feature, such as Android 4.2 default browsers
      if (document.createElement("p").style.flexWrap === '') {
        guiDiv.querySelector('.jp-toggles')?.classList.add('flexbox');
      }
    }
  }
}

export default getClass;