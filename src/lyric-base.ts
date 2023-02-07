import Emitter from "./emitter";
import { LyricBaseOptions } from "./lyric.d";

class LyricBase extends Emitter {
  lyricObj: {
    timeArray: Array<any>;
    lyricArray: Array<any>;
  } = {
    timeArray: [],
    lyricArray: []
  };
  lyric: any;
  lyricCurrentPosition = 0;
  mediaObject: any;
  container: any;
  constructor(options: LyricBaseOptions) {
    super();
    this.mediaObject = options.mediaObject;
    this.lyric = options.lyric;
    this.container = options.container;
  }
  parseLyricItems(items: any) {
    var result: Array<any> = [];
    var timePattern = /\[[0-9]{2}:[0-9]{2}\.[0-9]{2,3}\]/g;
    for (var i = 0, l = items.length; i < l; i++) {
      var thisItem = items[i];
      var timeSpanArray = thisItem.match(timePattern);
      if (timeSpanArray) {
        var lyric = thisItem.split(timePattern).pop();
        for (var j = 0, len = timeSpanArray.length; j < len; j++) {
          result.push(timeSpanArray[j] + lyric);
        }
      }
    }
    return result;
  }
  logLyricInfo(items: any) {
    var patt = /\[|\]/;
    for (var i = 0; i < items.length; i++) {
      var component = items[i].split(patt);
      if (component[2] === "") {
        // If no lyric
      }
      this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
      this.lyricObj.lyricArray.push(component[2]);
    }
  }

  compareTimeSpan(x: any, y: any): number {
    var timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2,3})\]/;
    var xTime = x.match(timePattern)[1],
      yTime = y.match(timePattern)[1];
    var xTimeInSeconds: number = this.parseTimeToSeconds(xTime),
      yTimeInSeconds: number = this.parseTimeToSeconds(yTime);
    return xTimeInSeconds - yTimeInSeconds;
  }

  parseTimeToSeconds(timeString: string): number {
    var component = timeString.split(".");
    var bigPart = component[0];
    var bigPartComponent = bigPart.split(":");
    var minutePart = parseInt(bigPartComponent[0]);
    var secondPart = parseInt(bigPartComponent[1]);
    return parseFloat(minutePart * 60 + secondPart + "." + component[1]);
  }

  addLyric() {
    var lyric = this.lyric;
    if (lyric) {
      var lyricItems = lyric.split(/[\n\r]/g);
      lyricItems = this.parseLyricItems(lyricItems);
      lyricItems.sort((x: any, y: any) => {
        return this.compareTimeSpan.call(this, x, y);
      });
      this.lyricObj.lyricArray.length = 0;
      this.lyricObj.timeArray.length = 0;
      this.lyricCurrentPosition = 0;
      this.trigger("lyricFetched", lyricItems);
      this.logLyricInfo(lyricItems);
    }
  }

  bindLyricEvents() {
    var that = this;
    var media = this.mediaObject;
    if (!media) return;
    media.addEventListener(
      "timeupdate",
      function () {
        if (
          that.lyric &&
          that.lyricObj.timeArray.length &&
          that.lyricObj.lyricArray.length
        ) {
          that.trigger("timeupdated", media.currentTime);
        }
      },
      false
    );
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

export default LyricBase;