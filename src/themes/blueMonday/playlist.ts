// @ts-nocheck
import type { PlayListOptions } from "../../core/playlist.d";
import { matches, uuidv4 } from "../../core/utils";
import tpl from './playlist.ejs';
import itemTpl from './playlistItem.ejs';
import './playlist.scss';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      options.cssSelectorAncestor = `#yuanplayer-bluemonday-playlist_${uuidv4()}`;
      super(options);
      const player = this.player;
      this.addEventListener(this.container, 'click', (e) => {
        const target = e.target as HTMLElement;
        if (player.cssSelector.repeat && matches(target, player.cssSelector?.repeat)) {
          this.switchModes();
        }
      });
    }
    protected onListUpdated() {
      this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = tpl({tracks: this.list});
      this.updateList();
    }
    protected onAdd() {
      const ul = this.container.querySelector('.yuan-playlist ul');
      const li = document.createElement('li');
      li.classList.add('yuan-playlist-item');
      li.innerHTML = itemTpl({index: this.list.length - 1, track: trackItem});
      ul.appendChild(li);
      this.updateList();
    }
    protected onRemove() {
      this.updateList();
    }
    protected onReady() {
      const div = document.createElement('div');
      div.id = this.cssSelectorAncestor.replace('#', '');
      div.className = 'yuanplayer-bluemonday-playlist';
      
      div.innerHTML = tpl({tracks: this.list});
      this.container.appendChild(div);
    }
    protected updateList() {
      if (this.list.length === 0) {
        this.container.querySelector('.yuan-playlist-empty').style.display = 'block';
      } else {
        this.container.querySelector('.yuan-playlist-empty').style.display = 'none';
      }
    }
  }
}

export default getClass;