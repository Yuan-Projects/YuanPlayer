import PlayList from "./playlist";
import type { CSSSelector, PlayListOptions } from './playlist.d';

export default class PlayListUI extends PlayList {
  cssSelector: CSSSelector = {
    remove: '.yuan-playlist-remove',
    next: '.yuan-next',
    previous: '.yuan-previous',
    shuffle: '.yuan-shuffle',
    item: '.yuan-playlist-item',
  };
  protected stateClass = {
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
      this.on('select', (index) => {
        this._highlightItem(index);
      });
      this.container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (this.cssSelector.item && target.matches(this.cssSelector?.item)) {
          this.play(); // TODO
        } else if (this.cssSelector.remove && target.matches(this.cssSelector?.remove)) {
          this.remove();// TODO
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
  private _highlightItem(index = this.index) {
    this.container.querySelector(this.cssSelector.item +'.'+this.stateClass.currentItem)?.classList.remove(this.stateClass.currentItem);
    const itemElements = this.container.querySelectorAll(this.cssSelector.item || '');
    if (itemElements.length) {
      itemElements[index]?.classList.add(this.stateClass.currentItem);
    }
  }
};