import type { CSSSelector, YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import playerTpl from './player.ejs';
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
        },
        stateClass: {
          playing: 'jp-state-playing',
          muted: 'jp-state-muted',
          looped: "jp-state-looped",
        }
      }
      const mergedOptions = merge(defaultOptions, options)
      super(mergedOptions);
      this.options = mergedOptions;
      if (!this.nativeControls) {
        this.renderPlayerUI();
      }
    }
  
    renderPlayerUI() {
      const div = document.createElement('div');
      div.id = this.options.cssSelectorAncestor?.substring(1) || '';
      div.classList.add('yuanplayer-pinkflag-player');
      div.innerHTML = playerTpl();
      this.container.appendChild(div);
    }
  }
}

export default getClass;