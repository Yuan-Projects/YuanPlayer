import { PlayListOptions } from "../../core/playlist.d";
// @ts-ignore
import itemTpl from './playlistItem.ejs';
// @ts-ignore
import tpl from './playlist.ejs';
import './playlist.scss';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      options.cssSelector = {
        ...options.cssSelector,
        item: '.music-item-container',
      };
      options.stateClass = {
        ...options.stateClass,
        currentItem: 'active',
      };
      super(options);

      this.renderUI();
      this.on('modechange', this.renderModeIcon.bind(this));
      this.on('shuffledchanged', () => {
        this.renderShuffleIcon();
        this.container.querySelector('.yuanplayer-yuan-playlist .track-list').innerHTML = this.list.map(item => itemTpl({ track: item })).join('');
      });
      this.on('add', () => {
        this.container.querySelector('.yuanplayer-yuan-playlist .track-list').innerHTML = this.list.map(item => itemTpl({ track: item })).join('');
        this._highlightItem();
      });
    }
    renderUI() {
      const container = this.container;
      const div = document.createElement('div');
      div.innerHTML = tpl({tracks: this.list});
      container.appendChild(div);
      container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('yuanplayer-yuan-playlist-repeat')) {
          this.switchModes();
        }
      });
      this.renderModeIcon();
    }

    renderModeIcon() {
      const element = this.container.querySelector('.yuanplayer-yuan-playlist-repeat');
      if (!element) return;
      let text = '';
      // 'off' | 'one' | 'all'
      switch(Base.modes[this.modeIndex]) {
        case 'one':
          text = 'repeat_one_on';
          break;
        case 'all':
          text = 'repeat_on';
          break;
        case 'off':
        default:
          text = 'repeat';
          break;
      }
      element.textContent = text;
    }
    renderShuffleIcon() {
      const element = this.container.querySelector('.yuan-shuffle');
      if (!element) return;
      let text = 'shuffle';
      if (this.shuffled) {
        text = 'shuffle_on';
      }
      element.textContent = text;
    }
  }
}

export default getClass;