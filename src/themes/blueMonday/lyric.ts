import { innerText } from '../../core/utils';
import { LyricOptions } from '../../core/lyric.d';
import './lyric.scss';

function getClass(Base) {
  return class YuanPlayerLyric extends Base {
    constructor(otpions: LyricOptions) {
      super(otpions);
      this.addContainer();
      this.on('lyricFetched', (lyricItems) => {
        debugger;
        this.container.querySelector('.yuanplayer-lyric-bluemonday-container')!.scrollTop = 0;
        this.addLyricItems(lyricItems);
      });
      this.on('timeupdated', (currentTime) => {
        this.scrollLyric(currentTime);
      });
      this.on('reset', () => {
        this.container.querySelector('.lyric-wrapcontainer').innerHTML = '<div>No lyric available.</div>';
      });
    }
    addContainer() {
      if (typeof this.lyric === 'string') {
        if (!this.container.querySelector('.yuanplayer-lyric-bluemonday-container')) {
          // Add container for lyric
          var lyricDiv = document.createElement('div');
          var wrapContainer = document.createElement('div');
          lyricDiv.classList.add('yuanplayer-lyric-bluemonday-container');
          wrapContainer.classList.add('lyric-wrapcontainer');
          this.container.appendChild(lyricDiv);
          lyricDiv.appendChild(wrapContainer);
        } else {
          const lyricContainer = this.container.querySelector('.yuanplayer-lyric-bluemonday-container');
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
        this.container.querySelector('.yuanplayer-lyric-bluemonday-container')!.scrollTop = newScrollTop;
      }
    }
  }
}

export default getClass;