import Emitter from "./emitter";
import type { PlayListOptions } from "./playlist.d";

/**
 * The PlayList base class should be extended by a theme file to implement the play list UI
 */
class PlayList extends Emitter {
  shuffled = false;
  static modes = ['off', 'one', 'all'];
  container: HTMLElement;
  player;
  lyricObj;
  index = 0;
  private originalList: Array<any> = [];
  list: Array<any> = [];
  modeIndex = 0;
  trackItemId = 0; // auto increment index, TODO: a robust id
  constructor(options: PlayListOptions) {
    super();
    this.container = options.container;
    this.modeIndex = PlayList.modes.indexOf(options.loop) > -1 ? PlayList.modes.indexOf(options.loop) : 0;
    this.player = options.player;
    this.lyricObj = options.lyricObj;
    const processedList = this.processList(options.list);
    this.originalList = processedList.slice(0);
    this.list = processedList.slice(0);

    this.addEvents();
  }
  processList(list) {
    const returnList = list.map(item => {
      return {
        ...item,
        id: typeof item.id === 'undefined' ? this.trackItemId++ : item.id
      }
    });
    return returnList;
  }
  shuffle() {
    this.list = [...this.originalList].sort(() => Math.random() - 0.5);
    this.index = 0;
    this.shuffled = true;
    if (this.player.isPlaying()) {
      this.playAtIndex();
    }
    this.trigger('shuffledChanged');
  }
  restore() {
    this.list = [...this.originalList];
    this.index = 0;
    this.shuffled = false;
    if (this.player.isPlaying()) {
      this.playAtIndex();
    }
    this.trigger('shuffledChanged');
  }
  add(trackItem) {
    this.originalList.push(trackItem);
    this.list.push(trackItem);
  }
  remove(trackItemId) {
    let indexToBeRemoved;
    for (let i = 0; i < this.originalList.length; i++) {
      if (this.originalList[i].id === trackItemId) {
        this.originalList.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].id === trackItemId) {
        indexToBeRemoved = i;
        this.list.splice(i, 1);
        break;
      }
    }
    // If this item is the current one
    if (indexToBeRemoved === this.index) {
      // Stop the playback first
      this.player.pause();
      // If there are items left, try to move onto the next one in the list, if it's the last one, use the previous one.
      if (this.list.length > 0) {
        // if it's the last one, use the previous one.
        if (indexToBeRemoved === this.list.length) {
          this.index--;
        } else {
          // try to move onto the next one in the list,
          this.index++;
        }
      } else {
        // If no one item left in the lists, reset the player object
        this.player.unload(); // TODO
      }
    } else {
      if (indexToBeRemoved < this.index) {
        this.index--;
      }
    }
  }
  switchModes() {
    const newVal = (++this.modeIndex) % PlayList.modes.length;
    this.modeIndex = newVal;
    this.trigger('modeChanged');
  }
  setMode(modeString: string) {
    if (PlayList.modes.includes(modeString) === false) return false;
    this.modeIndex = PlayList.modes.indexOf(modeString);
    this.trigger('modeChanged');
  }
  addEvents() {
    this.player.mediaObject.addEventListener('ended', () => {
      if (PlayList.modes[this.modeIndex] === 'off') {
        // Have played the last music
        if (this.index === this.list.length - 1) {
          // Reach the end;
          return;
        } else {
          this.index++;
          // Play the next one in the list
        }
      } else if (PlayList.modes[this.modeIndex] === 'one') {
        // Play current one
      } else if (PlayList.modes[this.modeIndex] === 'all') {
        if (this.index === this.list.length - 1) {
          // Reach the end;
          this.index = 0;
        } else {
          this.index++;
          // Play the next one in the list
        }
      }
      this.playAtIndex(this.index);
    });
  }
  playNextTrack() {
    if (this.index === this.list.length - 1) return false;
    this.index++;
    this.playAtIndex(this.index);
  }
  playPreviousTrack() {
    if (this.index === 0) return false;
    this.index--;
    this.playAtIndex(this.index);
  }
  playAtIndex(index: number = this.index) {
    if (index > this.list.length - 1) return false;
    if (this.player) {
      this.player.setMedia(this.list[index].source);
      this.player.mediaObject.load();
      this.player.play();
    }

    if (this.lyricObj) {
      this.lyricObj.lyric = this.list[index].lyric;
      this.lyricObj.addLyric();
    }
    this.trigger('playMusicAtIndex', index);
  }
}

export default PlayList;