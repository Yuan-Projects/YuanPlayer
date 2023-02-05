import Emitter from "./emitter";
import { PlayListBaseOptions } from "./playlist.d";

export default class PlayListBase extends Emitter {
  container;
  loop = 'none';
  //mediaObject;
  player;
  index = 0;
  list: Array<any> = [];
  constructor(options: PlayListBaseOptions) {
    super();
    this.container = options.container;
    this.loop = options.loop || 'none';
    this.player = options.player;
    this.list = options.list;

    this.addEvents();
  }
  addEvents() {
    this.player.mediaObject.addEventListener('ended', () => {
      if (this.loop === 'none') {
        // Have played the last music
        if (this.index === this.list.length - 1) {
          // Reach the end;
          return;
        } else {
          this.index++;
          // Play the next one in the list
        }
      } else if (this.loop === 'random') {
        this.index = Math.floor(Math.random() * this.list.length);
        // Play the new one
      } else if (this.loop === 'single') {
        // Play current one
      } else if (this.loop === 'order') {
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