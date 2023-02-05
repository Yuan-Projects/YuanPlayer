import Emitter from "./emitter";
import { PlayListBaseOptions } from "./playlist.d";

export default class PlayListBase extends Emitter {
  static modes = ['none', 'single', 'random', 'order'];
  container;
  //loop = 'none';
  //mediaObject;
  player;
  index = 0;
  list: Array<any> = [];
  modeIndex = 0;
  constructor(options: PlayListBaseOptions) {
    super();
    this.container = options.container;
    this.modeIndex = PlayListBase.modes.indexOf(options.loop) > -1 ? PlayListBase.modes.indexOf(options.loop) : 0;
    this.player = options.player;
    this.list = options.list;

    this.addEvents();
  }
  switchModes() {
    const newVal = (++this.modeIndex) % PlayListBase.modes.length;
    this.modeIndex = newVal;
    this.trigger('modeChanged');
  }
  addEvents() {
    this.player.mediaObject.addEventListener('ended', () => {
      if (PlayListBase.modes[this.modeIndex] === 'none') {
        // Have played the last music
        if (this.index === this.list.length - 1) {
          // Reach the end;
          return;
        } else {
          this.index++;
          // Play the next one in the list
        }
      } else if (PlayListBase.modes[this.modeIndex] === 'random') {
        this.index = Math.floor(Math.random() * this.list.length);
        // Play the new one
      } else if (PlayListBase.modes[this.modeIndex] === 'single') {
        // Play current one
      } else if (PlayListBase.modes[this.modeIndex] === 'order') {
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