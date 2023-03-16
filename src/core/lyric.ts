import Emitter from "./emitter";
import type { LyricObject, LyricOptions } from "./lyric.d";

/**
 * The Lyric panel base class.
 * It does not contain UI logic and should be extended by a theme file to implement a custom lyric panel.
 */
class Lyric extends Emitter {
  lyricObj: LyricObject = {
    timeArray: [],
    lyricArray: []
  };
  lyric: string;
  lyricCurrentPosition = 0;
  mediaElement;
  container: HTMLElement;
  player;
  constructor(options: LyricOptions) {
    super();
    this.mediaElement = options.mediaElement;
    this.lyric = options.lyric;
    this.container = options.container;
    this.player = options.player;
  }
  private parseLyricItems(items) {
    const result: Array<any> = [];
    const timePattern = /\[[0-9]{2}:[0-9]{2}\.[0-9]{2,3}\]/g;
    for (let i = 0, l = items.length; i < l; i++) {
      const thisItem = items[i];
      const timeSpanArray = thisItem.match(timePattern);
      if (timeSpanArray) {
        const lyric = thisItem.split(timePattern).pop();
        for (let j = 0, len = timeSpanArray.length; j < len; j++) {
          result.push(timeSpanArray[j] + lyric);
        }
      }
    }
    return result;
  }
  private logLyricInfo(items) {
    const patt = /\[|\]/;
    for (let i = 0; i < items.length; i++) {
      const component = items[i].split(patt);
      if (component[2] === "") {
        // If no lyric
      }
      this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
      this.lyricObj.lyricArray.push(component[2]);
    }
    this.trigger("lyricfetched", items);
  }

  private compareTimeSpan(x, y): number {
    const timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2,3})\]/;
    const xTime = x.match(timePattern)[1],
      yTime = y.match(timePattern)[1];
    const xTimeInSeconds: number = this.parseTimeToSeconds(xTime),
      yTimeInSeconds: number = this.parseTimeToSeconds(yTime);
    return xTimeInSeconds - yTimeInSeconds;
  }

  private parseTimeToSeconds(timeString: string): number {
    const component = timeString.split(".");
    const bigPart = component[0];
    const bigPartComponent = bigPart.split(":");
    const minutePart = parseInt(bigPartComponent[0]);
    const secondPart = parseInt(bigPartComponent[1]);
    return parseFloat(minutePart * 60 + secondPart + "." + component[1]);
  }

  private addLyric() {
    const lyric = this.lyric;
    if (lyric) {
      let lyricItems = lyric.split(/[\n\r]/g);
      lyricItems = this.parseLyricItems(lyricItems);
      lyricItems.sort((x, y) => {
        return this.compareTimeSpan.call(this, x, y);
      });
      this.lyricObj.lyricArray.length = 0;
      this.lyricObj.timeArray.length = 0;
      this.lyricCurrentPosition = 0;
      this.logLyricInfo(lyricItems);
    }
  }

  private bindLyricEvents() {
    const that = this;
    const media = this.mediaElement;
    if (!media) return;
    // TODO
    this.player.addEventListener(media, "timeupdate", function () {
      if (
        that.lyric &&
        that.lyricObj.timeArray.length &&
        that.lyricObj.lyricArray.length
      ) {
        that.trigger("timeupdated", media.currentTime);
      }
    });
  }

  protected getNewLyricIndex(currentTime): number {
    let index = 0;
    const timeArray = this.lyricObj.timeArray;
    const timeLength = timeArray.length;
    if (timeLength) {
      if(currentTime <= timeArray[0]) {
        return 0;
      }
      if(currentTime >= timeArray[timeLength-1]) {
        return timeLength - 1;
      }
      for (let i = 0; i < timeLength; i++) {
        if (currentTime <= timeArray[i]) {
          index = i - 1;
          break;
        }
      }
    }
    return index;
  }

  public loadLyricPlugin() {
    this.addLyric();
    this.bindLyricEvents();
  }
  public setLyric(lyric: string) {
    this.lyric = lyric;
    this.addLyric();
  }
  public unload() {
    this.lyric = '';
    this.lyricObj.lyricArray.length = 0;
    this.lyricObj.timeArray.length = 0;
    this.lyricCurrentPosition = 0;
    this.trigger('reset');
  }
  public destroy() {
    this.unload();
    this.removeAllEventListeners();
  }
}

export default Lyric;