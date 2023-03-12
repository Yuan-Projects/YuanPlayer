import { innerText } from '../../core/utils';
import { LyricOptions } from '../../core/lyric.d';
import './lyric.scss';

function getClass(Base) {
  return class YuanPlayerLyric extends Base {
    constructor(otpions: LyricOptions) {
      otpions.cssSelectorAncestor = '.yuanplayer-bluemonday-lyric';
      super(otpions);
      this.addContainer();
    }
    addContainer() {
      if (typeof this.lyric === 'string') {
        if (!this.container.querySelector('.yuanplayer-bluemonday-lyric')) {
          // Add container for lyric
          const lyricDiv = document.createElement('div');
          const wrapContainer = document.createElement('div');
          lyricDiv.classList.add('yuanplayer-bluemonday-lyric');
          lyricDiv.classList.add(this.stateClass.empty);
          wrapContainer.classList.add('lyric-wrapcontainer');
          this.container.appendChild(lyricDiv);
          lyricDiv.appendChild(wrapContainer);

          const emptyElement = document.createElement('div');
          emptyElement.classList.add(this.cssSelector.noContent.substring(1));
          emptyElement.textContent = 'No lyric available.';
          lyricDiv.appendChild(emptyElement);
        }
      }
    }
    addLyricItems(items: any) {
      const wrapContainer = this.container.querySelector('.lyric-wrapcontainer');  
      for (let i = 0, l = items.length; i < l; i++) {
        const div = document.createElement('div');
        div.classList.add(this.cssSelector.item.substring(1));
        const content = items[i].split(']')[1];
        innerText(div, content);
        wrapContainer?.appendChild(div);
      }
    }
  }
}

export default getClass;