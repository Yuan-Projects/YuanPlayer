import Lyric from "./lyric";
import type { LyricOptions } from "./lyric.d";

export default abstract class LyricUI extends Lyric {
  cssSelectorAncestor = '';
  cssSelector = {
    item: '.yuanplayer-lyric-item',
    noContent: '.yuanplayer-lyric-empty',
  };
  protected stateClass = {
    empty: 'empty',
    current: "highlight",
  };
  constructor(options: LyricOptions) {
    super(options);
    this.cssSelectorAncestor = options.cssSelectorAncestor;
    this.cssSelector = {
      ...this.cssSelector,
      ...options.cssSelector
    };
    this.addEventListeners();
    setTimeout(() => {
      this.loadLyricPlugin();
    }, 0);
  }
  protected abstract addLyricItems(addLyricItems);
  private addEventListeners() {
    setTimeout(() => {
      this.on('lyricfetched', (lyricItems) => {
        // @ts-ignore
        this.container.querySelector(this.cssSelectorAncestor)?.scrollTop = 0;
        // empty previous lyric items
        this._removeAllItems();
        if (this.addLyricItems) {
          this.addLyricItems(lyricItems);
        }
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
    const newLyricIndex = this.getNewLyricIndex(currentTime);
    const oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex === oldPosition) return ;
  
    this.lyricCurrentPosition = newLyricIndex;
  
    // Hightlight the current lyric
    const lyricDivs = this.container.querySelectorAll(this.cssSelector.item);
    if (lyricDivs.length) {
      lyricDivs[oldPosition].classList.remove(this.stateClass.current);
      lyricDivs[newLyricIndex].classList.add(this.stateClass.current);

      // Scroll the lyrics container
      const newScrollTop = (lyricDivs[newLyricIndex] as HTMLElement).offsetTop;
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
    if (isEmpty) {
      this._removeAllItems();
      this.container.querySelector(this.cssSelectorAncestor)?.classList.add(this.stateClass.empty);
    } else {
      this.container.querySelector(this.cssSelectorAncestor)?.classList.remove(this.stateClass.empty);
    }
    if (emptyElement) {
      emptyElement.style.display = isEmpty ? 'block' : 'none';
    }
  }
};