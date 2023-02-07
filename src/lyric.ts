import { innerText } from './utils';
import LyricBase from './lyric-base';
import { LyricBaseOptions } from './lyric.d';
import './lyric.scss';

class YuanPlayerLyric extends LyricBase {
  constructor(otpions: LyricBaseOptions) {
    super(otpions);
    this.addContainer();
    this.on('lyricFetched', (lyricItems) => {
      this.container.querySelector('.yuanplayer-lyric-container')!.scrollTop = 0;
      this.addLyricItems(lyricItems);
    });
    this.on('timeupdated', (currentTime) => {
      this.scrollLyric(currentTime);
    });
  }
  addContainer() {
    if (typeof this.lyric === 'string') {
      if (!this.container.querySelector('.yuanplayer-lyric-container')) {
        // Add container for lyric
        var lyricDiv = document.createElement('div');
        var wrapContainer = document.createElement('div');
        lyricDiv.classList.add('yuanplayer-lyric-container');
        wrapContainer.classList.add('lyric-wrapcontainer');
        this.container.appendChild(lyricDiv);
        lyricDiv.appendChild(wrapContainer);
      } else {
        const lyricContainer = document.querySelector('.yuanplayer-lyric-container');
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
      var content = items[i].split(']')[1];
      innerText(div, content);
      wrapContainer?.appendChild(div);
    }
  }

  scrollLyric(currentTime: number) {
    var newLyricIndex = this.getNewLyricIndex(currentTime);
    var oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex === oldPosition) return ;
  
    this.lyricCurrentPosition = newLyricIndex;
  
    // Hightlight the current lyric
    var lyricDivs = this.container.querySelector('.lyric-wrapcontainer')?.getElementsByTagName('div');
    if (lyricDivs) {
      lyricDivs[oldPosition].className =  '';
      lyricDivs[newLyricIndex].className = 'highlight';

      // Scroll the lyrics container
      var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
      // lyric-wrapcontainer
      this.container.querySelector('.yuanplayer-lyric-container')!.scrollTop = newScrollTop;
    }
  }
}

export default YuanPlayerLyric;