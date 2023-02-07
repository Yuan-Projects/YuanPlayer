import Emitter from "./emitter";
import type { PlayListOptions } from "./playlist.d";

/**
 * The PlayList base class should be extended by a theme file to implement the play list UI
 */
class PlayList extends Emitter {
  static themes = {};
  theme = '';
  static modes = ['none', 'single', 'random', 'order'];
  container;
  player;
  lyricObj;
  index = 0;
  list: Array<any> = [];
  modeIndex = 0;
  constructor(options: PlayListOptions) {
    super();
    this.container = options.container;
    this.modeIndex = PlayList.modes.indexOf(options.loop) > -1 ? PlayList.modes.indexOf(options.loop) : 0;
    this.player = options.player;
    this.lyricObj = options.lyricObj;
    this.list = options.list;
    this.theme = options.theme;

    this.addEvents();
  }
  switchModes() {
    const newVal = (++this.modeIndex) % PlayList.modes.length;
    this.modeIndex = newVal;
    this.trigger('modeChanged');
  }
  addEvents() {
    this.on('playMusicAtIndex', (index) => {
      if (this.lyricObj) {
        this.lyricObj.lyric = this.list[index].lyric;
        this.lyricObj.addLyric();
      }
    });
    this.player.mediaObject.addEventListener('ended', () => {
      if (PlayList.modes[this.modeIndex] === 'none') {
        // Have played the last music
        if (this.index === this.list.length - 1) {
          // Reach the end;
          return;
        } else {
          this.index++;
          // Play the next one in the list
        }
      } else if (PlayList.modes[this.modeIndex] === 'random') {
        this.index = Math.floor(Math.random() * this.list.length);
        // Play the new one
      } else if (PlayList.modes[this.modeIndex] === 'single') {
        // Play current one
      } else if (PlayList.modes[this.modeIndex] === 'order') {
        if (this.index === this.list.length - 1) {
          // Reach the end;
          this.index = 0;
        } else {
          this.index++;
          // Play the next one in the list
        }
      }
      //playMusicAtIndex(index);
      this.trigger('playMusicAtIndex', this.index);
    });
  }
}

export default PlayList;