import { PlayListOptions } from "../../core/playlist.d";
// @ts-ignore
import tpl from './playlist.ejs';
// @ts-ignore
import itemTpl from './playlistItem.ejs';

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
      this.on('shuffledChanged', () => {
        this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = tpl({tracks: this.list});
      });
      this.on('trackRemoved', (trackItemId) => {
        const ele = this.container.querySelector(`a[data-trackid="${trackItemId}"]`).parentNode.parentNode;
        ele.parentNode.removeChild(ele);
        if (this.list.length === 0) {
          this.container.querySelector('.yuan-playlist').innerHTML = '<div class="yuan-playlist-empty">The playlist is empty.</div>';
        }
        this.updateHighlight();
      });
      this.on('trackAdded', (trackItem) => {
        if (this.list.length === 1) {
          this.container.querySelector('.yuan-playlist').removeChild(this.container.querySelector('.yuan-playlist-empty'));
        }
        const ul = this.container.querySelector('.yuan-playlist ul');
        const li = document.createElement('li');
        li.innerHTML = itemTpl({index: this.list.length - 1, track: trackItem});
        ul.appendChild(li);
      });
    }
  }
}

export default getClass;