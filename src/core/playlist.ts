import Emitter from "./emitter";
import type { PlayListItem, PlayListOptions } from "./playlist.d";

/**
 * The PlayList base class should be extended by a theme file to implement the play list UI
 */
class PlayList extends Emitter {
  protected autoPlay = false;
  protected enableRemoveControls = false;
  protected shuffled = false;
  static modes = ['off', 'one', 'all'];
  protected container: HTMLElement;
  protected player; // a Player instance
  protected lyricObj; // a Lyric instance 
  protected index = 0; // current index in the list
  private originalList: Array<any> = []; // Array of Objects: The original playlist
  protected list: Array<any> = []; // Array of Objects: The current playlist displayed (Un-shuffled or Shuffled)
  protected modeIndex = 0; // Current mode
  constructor(options: PlayListOptions) {
    super();
    this.container = options.container;
    this.modeIndex = options.loop && PlayList.modes.indexOf(options.loop) > -1 ? PlayList.modes.indexOf(options.loop) : 0;
    this.player = options.player;
    this.lyricObj = options.lyricObj;
    this.setPlaylist(options.list);
    this.autoPlay = !!options.autoPlay;
    if (this.list.length) {
      if (this.autoPlay) {
        this.play(0);
      } else {
        this.select(0);
      }
    }
    this.addEvents();
  }
  /**
   * Tested 1
   * Shuffle the playlist.
   * Toggles shuffled setting if no param is given.
   * (playNow can only be used if the first param is given. Use shuffle(undefined,true) to toggle and play.)
   * 
   * @param shuffled - True always shuffles the playlist. False will un-shuffle if it was shuffled. 
   * @param playNow - Cause the first item to play automatically.
   */
  public shuffle(shuffled?: undefined | boolean, playNow?: boolean): void {
    if (this.player) {
      this.player.stop();
    }
    if (shuffled === undefined) {
      // Toggle shuffle state
      if (this.shuffled) {
        this.restoreList();
      } else {
        this.shuffleList();
      }
    } else if (shuffled === true) {
      this.shuffleList();
    } else {
      this.restoreList();
    }

    if (playNow) {
      this.play(0);
    } else {
      this.select(0);
    }
  }
  /**
   * Tested 1
   * Change the playlist.
   * @param playlist 
   */
  public setPlaylist(playlist: Array<PlayListItem>) {
    this.index = 0;
    this.shuffled = false;
    this.list = [...playlist];
    this.originalList = [...playlist];
  }
  private shuffleList() {
    this.list = [...this.originalList].sort(() => Math.random() - 0.5);
    this.index = 0;
    this.shuffled = true;
    if (this.player.isPlaying()) {
      this.play();
    }
    this.trigger('shuffledchanged');
  }
  private restoreList() {
    this.list = [...this.originalList];
    this.index = 0;
    this.shuffled = false;
    if (this.player.isPlaying()) {
      this.play();
    }
    this.trigger('shuffledchanged');
  }
  /**
   * Tested 1
   * Add a media item to the end of the playlist.
   * @param media 
   * @param playNow - If it's true, start it playing after adding it.
   */
  public add(media: PlayListItem, playNow = false) {
    this.originalList.push(media);
    this.list.push(media);
    if (playNow) {
      this.play(this.list.length - 1);
    } else {
      if (this.originalList.length === 1) {
        this.select(0);
      }
    }
    this.trigger('add', media);
  }
  /**
   * Tested 1
   * Selects the item in the playlist.
   * @param index - A positive index selects items from the start of the playlist while a negative index selects items from the end.
   */
  public select(index: number = this.index) {
    index = (index < 0) ? this.originalList.length + index : index; // Negative index relates to end of array.
    if (0 <= index && index < this.list.length) {
      this.index = index;
    } else {
      this.index = 0;
    }
    this.trigger('select', this.index);
  }
  /**
   * Tested 1
   * Removes the item from the playlist. Removes all items if no param is given.
   * @param trackItemId - A positive index removes items from the start of the playlist while a negative index removes items from the end.
   */
  public remove(index?: number) {
    if (index === undefined) {
      this.setPlaylist([]);
    } else {
      index = (index < 0) ? this.originalList.length + index : index;
      if (0 <= index && index < this.list.length) {
        if (this.shuffled) {
          const item = this.list[index];
          this.list.splice(index, 1);
          for (let i = 0; i < this.originalList.length; i++) {
            if (this.originalList[i] === item) {
              this.originalList.splice(i, 1);
              break;
            }
          }
        } else {
          this.list.splice(index, 1);
          this.originalList.splice(index, 1);
        }
        if (this.originalList.length) {
          if (index === this.index) {
            this.player.stop();// stop current playback
            this.index = (index < this.originalList.length) ? this.index : this.originalList.length - 1; // To cope when last element being selected when it was removed
            this.select(this.index);
          } else if (index < this.index) {
            this.index--;
          }
        } else {
          // no item left
          // TODO
          this.player.clearMedia(); // TODO
          this.lyricObj.unload(); // TODO
        }
        this.trigger('remove', index);
      }
    }
  }
  public switchModes() {
    const newVal = (++this.modeIndex) % PlayList.modes.length;
    this.modeIndex = newVal;
    this.trigger('modechange');
  }
  public setMode(modeString: string) {
    if (PlayList.modes.indexOf(modeString) === -1) return false;
    this.modeIndex = PlayList.modes.indexOf(modeString);
    this.trigger('modechange');
  }
  private addEvents() {
    this.on('select', index => {
      this.updatePlayerLyric(index);
    });
    this.player.on('ended', () => {
      const mode = PlayList.modes[this.modeIndex];
      if (mode === 'off') {
        // Have played the last music
        if (this.index === this.list.length - 1) {
          // Reach the end;
          return;
        } else {
          this.index++;
          // Play the next one in the list
        }
      } else if (mode === 'one') {
        // Play current one
      } else if (mode === 'all') {
        if (this.index === this.list.length - 1) {
          // Reach the end;
          this.index = 0;
        } else {
          this.index++;
          // Play the next one in the list
        }
      }
      this.play(this.index);
    });
  }
  /**
   * Tested 1
   * Move to and play the next item in the playlist.
   * @returns 
   */
  public next() {
    if (this.index === this.list.length - 1) return false;
    this.play(this.index + 1);
  }
  /**
   * Tested 1
   * Move to and play the previous item in the playlist. 
   * @returns 
   */
  public previous() {
    if (this.index === 0) return false;
    this.play(this.index - 1);
  }
  /**
   * Tested 1
   * Plays the item in the playlist.
   * @param index - Plays the current item if no param is given. A positive index plays items from the start of the playlist while a negative index plays items from the end.
   * @returns 
   */
  public play(index: number = this.index) {
    index = (index < 0) ? this.originalList.length + index : index;
    if (index > this.list.length - 1 || index < 0 || this.list.length === 0) return false;
    if (index !== this.index) {
      this.select(index);
    }
    //this.updatePlayerLyric(index);
    if (this.player) {
      this.player.play();
    }
  }
  /**
   * Tested 1
   * Pause the current item.
   */
  public pause() {
    if (this.player) {
      this.player.pause();
    }
  }
  protected updatePlayerLyric(index) {
    if (index > this.list.length - 1) return false;
    if (this.player) {
      this.player.setMedia(this.list[index]);
    }

    if (this.lyricObj) {
      this.lyricObj.lyric = this.list[index].lyric;
      this.lyricObj.addLyric();
    }
  }
}

export default PlayList;