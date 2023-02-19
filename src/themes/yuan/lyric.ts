import { innerText } from '../../core/utils';
import { LyricOptions } from '../../core/lyric.d';
import './lyric.scss';

function getClass(Base) {
  return class YuanPlayerLyric extends Base {
    constructor(otpions: LyricOptions) {
      otpions.cssSelectorAncestor = '.yuanplayer-yuan-lyric';
      super(otpions);
      this.addContainer();
      this.on('lyricfetched', (lyricItems) => {
        this.addLyricItems(lyricItems);
      });
    }
    addContainer() {
      if (typeof this.lyric === 'string') {
        if (!this.container.querySelector('.yuanplayer-yuan-lyric')) {
          // Add container for lyric
          var lyricDiv = document.createElement('div');
          var wrapContainer = document.createElement('div');
          lyricDiv.classList.add('yuanplayer-yuan-lyric');
          wrapContainer.classList.add('lyric-wrapcontainer');
          this.container.appendChild(lyricDiv);
          lyricDiv.appendChild(wrapContainer);
        } else {
          const lyricContainer = document.querySelector('.yuanplayer-yuan-lyric');
          if (lyricContainer) {
            lyricContainer.innerHTML = '<div id="lyric-wrapcontainer"></div>';
          }
        }
      }
    }
    addLyricItems(items: any) {
      var wrapContainer = this.container.querySelector('.lyric-wrapcontainer');
      wrapContainer.innerHTML = '';
  
      for (var i = 0, l = items.length; i < l; i++) {
        var div = document.createElement('div');
        div.classList.add(this.cssSelector.item);
        var content = items[i].split(']')[1];
        innerText(div, content);
        wrapContainer?.appendChild(div);
      }
    }
  }
}

export default getClass;