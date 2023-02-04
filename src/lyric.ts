// @ts-ignore
import { ajax, innerText } from './utils';

class YuanPlayerLyric {
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
  constructor(mediaObject: any, lyric: string) {
    this.mediaObject = mediaObject;
    this.lyric = lyric;
  }
  addLyricItems(items: any) {
    var lyricContainer = document.getElementById('lyric-container');
    var wrapContainer = document.getElementById('lyric-wrapcontainer');

    for (var i = 0, l = items.length; i < l; i++) {
      var div = document.createElement('div');
      var content = items[i].split(']')[1];
      innerText(div, content);
      wrapContainer?.appendChild(div);
    }
  }
  parseLyricItems(items: any) {
    var result: Array<any> = [];
    var timePattern = /\[[0-9]{2}:[0-9]{2}\.[0-9]{2,3}\]/g;
    for(var i = 0, l = items.length; i < l; i++) {
      var thisItem = items[i];
      var timeSpanArray = thisItem.match(timePattern);
      if (timeSpanArray) {
        var lyric = thisItem.split(timePattern).pop();
        for (var j = 0, len = timeSpanArray.length; j < len; j++) {
          result.push(timeSpanArray[j]+lyric);
        }
      };
    }
    return result;
  }
  logLyricInfo(items: any){
    var patt = /\[|\]/;
    for (var i = 0; i < items.length; i++) {
      var component = items[i].split(patt);
      if (component[2] === '') {
        // If no lyric
      }
      this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
      this.lyricObj.lyricArray.push(component[2]);
    }
  }

  compareTimeSpan(x: any,y:any): number {
    var timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2,3})\]/;
    var xTime = x.match(timePattern)[1], yTime = y.match(timePattern)[1];
    var xTimeInSeconds: number = this.parseTimeToSeconds(xTime), yTimeInSeconds: number = this.parseTimeToSeconds(yTime);
    //debugger;
    return xTimeInSeconds - yTimeInSeconds;
  }

  parseTimeToSeconds(timeString: string): number {
    var component = timeString.split('.');
    var bigPart = component[0];
    var bigPartComponent = bigPart.split(':');
    var minutePart = parseInt(bigPartComponent[0]);
    var secondPart = parseInt(bigPartComponent[1]);
    return parseFloat(minutePart * 60 + secondPart + '.' + component[1]);
  }

  addLyric() {
    var that = this;
    var lyric = this.lyric;
    if (lyric) {
      if (typeof lyric === 'string') {
        if (!document.getElementById('lyric-container')) {
          // Add container for lyric
          var lyricDiv = document.createElement('div');
          var wrapContainer = document.createElement('div');
          lyricDiv.id = "lyric-container";
          wrapContainer.id = "lyric-wrapcontainer";
          document.body.appendChild(lyricDiv);
          lyricDiv.appendChild(wrapContainer);
        } else {
          const lyricContainer = document.getElementById('lyric-container');
          if (lyricContainer) {
            lyricContainer.innerHTML = '<div id="lyric-wrapcontainer"></div>';
          }
        }
  
        if (lyric.substr(0, 8) === 'https://' || lyric.substr(0, 7) === 'http://') {
          ajax({url:lyric, contentType: "text/plain"}).then(function(lyricText: any){
            var lyricItems = lyricText.responseText.split(/[\n\r]/g);
            lyricItems = that.parseLyricItems(lyricItems);
            lyricItems.sort(function(x: any,y: any){ return that.compareTimeSpan.call(that,x,y);});
            that.addLyricItems(lyricItems);
            that.logLyricInfo(lyricItems);
          },function(err: any){
            console.log('error:', err);
          });
        }
  
      }
    }
  }

  bindLyricEvents() {
    var that = this;
    var media = this.mediaObject;
    if (!media) return ;
    media.addEventListener('timeupdate', function(){
      if (that.lyric && that.lyricObj.timeArray.length && that.lyricObj.lyricArray.length) {
        that.scrollLyric(media.currentTime);
      }
    }, false);
  }

  scrollLyric(currentTime:any) {
    var newLyricIndex = this.getNewLyricIndex(currentTime);
    var oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex === oldPosition) return ;
  
    this.lyricCurrentPosition = newLyricIndex;
  
    // Hightlight the current lyric
    var lyricDivs = document.getElementById('lyric-wrapcontainer')?.getElementsByTagName('div');
    if (lyricDivs) {
      lyricDivs[oldPosition].className =  '';
      lyricDivs[newLyricIndex].className = 'highlight';

      // Scroll the lyrics container
      var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
      document.getElementById('lyric-container')!.scrollTop = newScrollTop;
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

  loadLyricPlugin() {
    this.addLyric();
    this.bindLyricEvents();
  }
}

export default YuanPlayerLyric;