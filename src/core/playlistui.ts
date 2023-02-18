import PlayList from "./playlist";
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
        this.container.classList.toggle(this.stateClass.shuffled);
      });
      this.on('modechange', () => {
        // TODO
      });
      this._highlightItem();
      this.on('remove', (index) => {
        this.container.querySelectorAll(this.cssSelector.item || '')[index]?.remove();
        this._highlightItem();
      })
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
        } else if (this.cssSelector.next && target.matches(this.cssSelector?.next)) {
          this.next();
        } else if (this.cssSelector.previous && target.matches(this.cssSelector?.previous)) {
          this.previous();
        } else if (this.cssSelector.shuffle && target.matches(this.cssSelector.shuffle)) {
          this.shuffle();
        }
      });
    }, 0);
  }
  private isMatchedWithSelector(dom, cssSelector, rootElement = this.container): boolean {
    if (!cssSelector) return false;
    do {
      if (dom.matches(cssSelector)) {
        return true;
      }
      dom = dom.parentNode;
    } while (dom !== rootElement);
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
      if (dom.matches(this.cssSelector.item)) {
        return dom;
      }
      dom = dom.parentNode;
    } while (dom !== this.container);
    return null;
  }
  protected _highlightItem(index = this.index) {
    this.container.querySelector(this.cssSelector.item + '.' + this.stateClass.currentItem)?.classList.remove(this.stateClass.currentItem || '');
    const itemElements = this.container.querySelectorAll(this.cssSelector.item || '');
    if (itemElements.length) {
      itemElements[index]?.classList.add(this.stateClass.currentItem || '');
    }
  }
};