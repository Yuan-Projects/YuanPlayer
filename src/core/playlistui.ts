import PlayList from "./playlist";
import { matches } from "./utils";
import type { CSSSelector, PlayListOptions } from './playlist.d';

export default class PlayListUI extends PlayList {
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
  constructor(options: PlayListOptions) {
    super(options);
    this.autoPlay = !!options.autoPlay;
    this.enableRemoveControls = !!options.enableRemoveControls;
    this.cssSelector = {
      ...this.cssSelector,
      ...options.cssSelector
    };
    this.stateClass = {
      ...this.stateClass,
      ...options.stateClass
    };
    this._addEventListeners();
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
      this._highlightItem();
      this.on('remove', (index) => {
        this.container.querySelectorAll(this.cssSelector.item || '')[index]?.remove();
        this._highlightItem();
      });
      this.on('select', (index) => {
        this._highlightItem(index);
      });
      this.container.addEventListener('click', (e) => {
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
  protected _highlightItem(index = this.index) {
    this.container.querySelector(this.cssSelector.item + '.' + this.stateClass.currentItem)?.classList.remove(this.stateClass.currentItem || '');
    const itemElements = this.container.querySelectorAll(this.cssSelector.item || '');
    if (itemElements.length) {
      itemElements[index]?.classList.add(this.stateClass.currentItem || '');
    }
  }
}