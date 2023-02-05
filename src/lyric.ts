import { innerText } from './utils';
import LyricBase from './lyric-base';
import { LyricBaseOptions } from './lyric.d';
import './lyric.scss';

class YuanPlayerLyric extends LyricBase {
  lyricObj: {
    timeArray: Array<any>,
    lyricArray: Array<any>
  } = {
    timeArray: [],
    lyricArray: []
  };
  lyric: any;
  lyricCurrentPosition = 0;
  mediaObject: any;
  constructor(otpions: LyricBaseOptions) {
    super(otpions);
    this.addContainer();
    this.on('lyricFetched', (lyricItems) => {
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

    for (var i = 0, l = items.length; i < l; i++) {
      var div = document.createElement('div');
      var content = items[i].split(']')[1];
      innerText(div, content);
      wrapContainer?.appendChild(div);
    }
  }

  scrollLyric(currentTime:any) {
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

  getNewLyricIndex(currentTime:any) {
    var index = 0;
    var timeArray = this.lyricObj.timeArray;
    var timeLength = timeArray.length;
    if (timeLength) {
      if(currentTime <= timeArray[0]) {
        return 0;
      }
      if(currentTime >= timeArray[timeLength-1]) {
        return timeLength - 1;
      }
      for (var i = 0; i < timeLength; i++) {
        if (currentTime <= timeArray[i]) {
          index = i - 1;
          break;
        }
      }
    }
    return index;
  }
}

export default YuanPlayerLyric;