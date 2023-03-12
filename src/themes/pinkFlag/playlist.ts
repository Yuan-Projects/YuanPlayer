import type { PlayListOptions } from "../../core/playlist.d";
import { matches, merge } from "../../core/utils";
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
      const mergedOptions: any = merge(defaultOptions, {
        ...options,
        player: {},
        lyricObj: {}
      });
      mergedOptions.player = options.player;
      mergedOptions.lyricObj = options.lyricObj;
      mergedOptions.cssSelectorAncestor = options.player.cssSelectorAncestor;
      super(mergedOptions);
      this.options = mergedOptions;
      const player = this.player;
      this.addEventListener(this.container, 'click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (player.cssSelector.repeat && matches(target, player.cssSelector?.repeat)) {
          if (this.modeIndex === 0) {
            this.setMode('all');
          } else {
            this.setMode('off');
          }
        }
      });
    }
    protected onReady() {
      this.renderList();
      this.highlightItem();
    }
    protected onAdd() {
      this.renderList();
      this.highlightItem();
    }
    protected onListUpdated() {
      this.renderList();
      this.highlightItem();
    }
    protected renderList() {
      const ulElement = this.container.querySelector('.jp-playlist ul');
      ulElement.innerHTML = this.list.map(item => {
        return itemTpl({track: item});
      }).join('');
    }
  }
}

export default getClass;