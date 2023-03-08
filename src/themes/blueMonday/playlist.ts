// @ts-nocheck
import type { PlayListOptions } from "../../core/playlist.d";
import { matches } from "../../core/utils";
import tpl from './playlist.ejs';
import itemTpl from './playlistItem.ejs';
import './playlist.scss';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      super(options);
      this.renderUI();
      this.addEventListeners();
    }
    renderUI() {
      const div = document.createElement('div');
      div.className = 'yuanplayer-bluemonday-playlist';
      
      div.innerHTML = tpl({tracks: this.list});
      this.container.appendChild(div);
    }
    addEventListeners() {
      const player = this.player;
      this.container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (player.cssSelector.repeat && matches(target, player.cssSelector?.repeat)) {
          this.switchModes();
        }
      });
      this.on('shuffledchanged', () => {
        this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = tpl({tracks: this.list});
      });
      this.on('remove', (trackItemId) => {
        this.updateList();
      });
      this.on('playlistset', () => {
        this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = tpl({tracks: this.list});
        this.updateList();
      });
      this.on('add', (trackItem) => {
        let ul = this.container.querySelector('.yuan-playlist ul');
        const li = document.createElement('li');
        li.classList.add('yuan-playlist-item');
        li.innerHTML = itemTpl({index: this.list.length - 1, track: trackItem});
        ul.appendChild(li);
        this.updateList();
      });
    }
    updateList() {
      if (this.list.length === 0) {
        this.container.querySelector('.yuan-playlist-empty').style.display = 'block';
      } else {
        this.container.querySelector('.yuan-playlist-empty').style.display = 'none';
      }
      this._highlightItem();
    }
  }
}

export default getClass;