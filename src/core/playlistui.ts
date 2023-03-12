import PlayList from "./playlist";
import { matches } from "./utils";
import type { CSSSelector, PlayListOptions } from './playlist.d';

export default abstract class PlayListUI extends PlayList {
  protected cssSelectorAncestor: string = '';
  cssSelector: CSSSelector = {
    remove: '.yuan-playlist-item-remove',
    next: '.yuan-next',
    previous: '.yuan-previous',
    shuffle: '.yuan-shuffle',
    item: '.yuan-playlist-item',
  };
  stateClass = {
    shuffled: "yuan-state-shuffled",
    currentItem: 'yuan-playlist-current',
  };
  protected abstract onReady();
  protected abstract onListUpdated();
  protected abstract onRemove();
  protected abstract onAdd();
  constructor(options: PlayListOptions) {
    super(options);
    this.addEvents();
    this.autoPlay = !!options.autoPlay;
    this.enableRemoveControls = !!options.enableRemoveControls;
    this.cssSelectorAncestor = options.cssSelectorAncestor || '';
    this.cssSelector = {
      ...this.cssSelector,
      ...options.cssSelector
    };
    this.stateClass = {
      ...this.stateClass,
      ...options.stateClass
    };
    this?.onReady();
    this._addEventListeners();
  }
  private addEvents() {
    this.on('destroy', () => {
      this.removeAllEventListeners();
      if (this.cssSelectorAncestor) {
        this.container.querySelector(this.cssSelectorAncestor)?.remove();
      }
    });
    this.on('add', () => {
      if (this.onAdd) {
        this.onAdd();
      }
    });
    this.on('playlistset', () => {
      this.onListUpdated();
    });
    this.on('select', index => {
      this.updatePlayerLyric(index);
      this.highlightItem(index);
      this.updateRepeatButtonState();
    });
    this.player.on('ended', () => {
      const mode = PlayList.modes[this.modeIndex];
      let index = -1;
      if (mode === 'off') {
        // Have played the last music
        if (this.index === this.list.length - 1) {
          // Reach the end;
          return;
        } else {
          index = this.index + 1;
          // Play the next one in the list
        }
      } else if (mode === 'one') {
        // Play current one
        index = this.index;
      } else if (mode === 'all') {
        if (this.index === this.list.length - 1) {
          // Reach the end;
          index = 0;
        } else {
          index = this.index + 1;
          // Play the next one in the list
        }
      }
      if (index > -1) {
        this.play(index);
      }
    });
  }
  protected updatePlayerLyric(index) {
    if (index > this.list.length - 1) return false;
    if (this.player) {
      this.player.setMedia(this.list[index]);
    }

    if (this.lyricObj) {
      this.lyricObj.lyric = this.list[index].lyric;
      if (this.lyricObj && this.lyricObj.addLyric) {
        this.lyricObj.addLyric();
      }
    }
  }
  private _addEventListeners() {
    setTimeout(() => {
      this.on('shuffledchanged', () => {
        if (this.shuffled) {
          this.container.classList.add(this.stateClass.shuffled);
          document.querySelector(this.player.cssSelectorAncestor)?.classList.add(this.stateClass.shuffled);
        } else {
          this.container.classList.remove(this.stateClass.shuffled);
          document.querySelector(this.player.cssSelectorAncestor)?.classList.remove(this.stateClass.shuffled);
        }
      });
      this.on('modechange', () => {
        this.updateRepeatButtonState();
      });
      this.highlightItem();
      this.on('remove', (index) => {
        this.container.querySelectorAll(this.cssSelector.item || '')[index]?.remove();
        this.highlightItem();
        if (this.onRemove) {
          this.onRemove();
        }
      });
      this.addEventListener(this.container, 'click', (e) => {
        const target = e.target as HTMLElement;
        if (this.isMatchedWithSelector(target, this.cssSelector.remove)) {
          const itemElement = this.findItemElement(target);
          const index = this.findDomIndex(itemElement);
          this.remove(index);// TODO
        } else if (this.isMatchedWithSelector(target, this.cssSelector.item)) {
          const itemElement = this.findItemElement(target);
          const index = this.findDomIndex(itemElement);
          this.play(index); // TODO
        } else if (this.cssSelector.next && matches(target, this.cssSelector?.next)) {
          this.next();
        } else if (this.cssSelector.previous && matches(target, this.cssSelector?.previous)) {
          this.previous();
        } else if (this.cssSelector.shuffle && matches(target, this.cssSelector.shuffle)) {
          this.shuffle();
        }
      });
      this.updateRepeatButtonState();
    }, 0);
  }
  private updateRepeatButtonState() {
    if (this.modeIndex === 0) {
      document.querySelector(this.player.cssSelectorAncestor)?.classList.remove(this.player.stateClass.looped);
      document.querySelector(this.player.cssSelectorAncestor)?.querySelector(this.player.cssSelector.repeat).classList.remove(this.player.stateClass.repeatOne);
    } else if (this.modeIndex === 1) {
      document.querySelector(this.player.cssSelectorAncestor)?.classList.add(this.player.stateClass.looped);
      document.querySelector(this.player.cssSelectorAncestor)?.querySelector(this.player.cssSelector.repeat).classList.add(this.player.stateClass.repeatOne);
    } else if (this.modeIndex === 2) {
      document.querySelector(this.player.cssSelectorAncestor)?.classList.add(this.player.stateClass.looped);
      document.querySelector(this.player.cssSelectorAncestor)?.querySelector(this.player.cssSelector.repeat).classList.remove(this.player.stateClass.repeatOne);
    }
  }
  private isMatchedWithSelector(dom, cssSelector, rootElement = this.container): boolean {
    if (!cssSelector) return false;
    do {
      if (matches(dom, cssSelector)) {
        return true;
      }
      dom = dom.parentNode;
    } while (dom !== rootElement && dom !== document);
    return false;
  }
  protected findDomIndex(element: HTMLElement): number {
    const allItemElements = this.container.querySelectorAll(this.cssSelector.item || '');
    for (let i = 0; i < allItemElements.length; i++) {
      if (allItemElements[i] === element) {
        return i;
      }
    }
    return 0;
  }
  protected findItemElement(dom) {
    do {
      if (matches(dom, this.cssSelector.item)) {
        return dom;
      }
      dom = dom.parentNode;
    } while (dom !== this.container && dom !== document);
    return null;
  }
  protected highlightItem(index = this.index) {
    this.container.querySelector(this.cssSelector.item + '.' + this.stateClass.currentItem)?.classList.remove(this.stateClass.currentItem || '');
    const itemElements = this.container.querySelectorAll(this.cssSelector.item || '');
    if (itemElements.length) {
      itemElements[index]?.classList.add(this.stateClass.currentItem || '');
    }
  }
}