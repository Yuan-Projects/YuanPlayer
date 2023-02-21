import type { PlayListOptions } from "../../core/playlist.d";
import { merge } from "../../core/utils";
// @ts-ignore
import itemTpl from './playlistItem.ejs';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    options;
    constructor(options: PlayListOptions) {
      const defaultOptions = {
        cssSelector: {
          item: '.jp-playlist li',
          shuffle: '.jp-shuffle',
          remove: '.jp-playlist-item-remove',
          next: '.jp-next',
          previous: '.jp-previous',
        },
        stateClass: {
          shuffled: 'jp-state-shuffled',
          currentItem: 'jp-playlist-current',
        }
      }
      const mergedOptions: any = merge(defaultOptions, options);
      mergedOptions.player = options.player;
      mergedOptions.cssSelectorAncestor = options.player.cssSelectorAncestor;
      super(mergedOptions);
      this.options = mergedOptions;
      this.addEventListeners();
      this.renderList();
      this._highlightItem();
    }
    addEventListeners() {
      this.on('shuffledchanged', () => {
        this.renderList();
      });
      
      this.on('add', (trackItem) => {
        this.renderList();
        this._highlightItem();
      });
    }
    renderList() {
      const ulElement = document.querySelector(this.options.cssSelectorAncestor).querySelector('.jp-playlist ul');
      ulElement.innerHTML = this.list.map(item => {
        return itemTpl({track: item});
      }).join('');
    }
  }
}

export default getClass;