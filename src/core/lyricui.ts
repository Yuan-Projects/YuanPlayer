import Lyric from "./lyric";
import type { LyricObject, LyricOptions } from "./lyric.d";

export default class LyricUI extends Lyric {
  cssSelectorAncestor = '';
  cssSelector = {
    item: '.yuanplayer-lyric-item',
    noContent: '.yuanplayer-lyric-empty',
  };
  protected stateClass = {
    current: "highlight",
  };
  constructor(options: LyricOptions) {
    super(options);
    this.cssSelectorAncestor = options.cssSelectorAncestor;
    this.cssSelector = {
      ...this.cssSelector,
      ...options.cssSelector
    };
    this._addEventListeners();
    setTimeout(() => {
      this.loadLyricPlugin();
    }, 0);
  }
  private _addEventListeners() {
    setTimeout(() => {
      this.on('lyricfetched', (lyricItems) => {
        this.container.querySelector(this.cssSelectorAncestor)!.scrollTop = 0;
        // empty previous lyric items
        this._removeAllItems();
        this._updatePanel();
      });
      this.on('timeupdated', (currentTime) => {
        this.scrollLyric(currentTime);
      });
      this.on('reset', () => {
        this._updatePanel();
      });
    }, 0);
  }
  protected scrollLyric(currentTime: number) {
    var newLyricIndex = this.getNewLyricIndex(currentTime);
    var oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex === oldPosition) return ;
  
    this.lyricCurrentPosition = newLyricIndex;
  
    // Hightlight the current lyric
    var lyricDivs = this.container.querySelectorAll(this.cssSelector.item);
    if (lyricDivs.length) {
      lyricDivs[oldPosition].classList.remove(this.stateClass.current);
      lyricDivs[newLyricIndex].classList.add(this.stateClass.current);

      // Scroll the lyrics container
      var newScrollTop = (lyricDivs[newLyricIndex] as HTMLElement).offsetTop;
      // lyric-wrapcontainer
      this.container.querySelector(this.cssSelectorAncestor)!.scrollTop = newScrollTop;
    }
  }
  protected _removeAllItems() {
    const itemElements = this.container.querySelectorAll(this.cssSelector.item);
    for (let i = 0; i < itemElements.length; i++) {
      itemElements[i].remove();
    }
  }
  protected _updatePanel() {
    const isEmpty = this.lyricObj.lyricArray.length === 0;
    const emptyElement = (this.container.querySelector(this.cssSelector.noContent) as HTMLElement);
    if (emptyElement) {
      emptyElement.style.display = isEmpty ? 'block' : 'none';
    }
  }
};