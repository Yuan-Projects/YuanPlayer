import "./element-remove";
import Player from "./playerui";
import Lyric from "./lyricui";
import PlayList from "./playlistui";

class YuanPlayer {
  static instances: Array<any> = [];
  constructor(options) {
    return new (YuanPlayer.use())(options);
  }
  static use(themeObject: any = {}) {
    const obj= {
      Player: themeObject.Player ? themeObject.Player(Player) : Player,
      Lyric: themeObject.Lyric ? themeObject.Lyric(Lyric) : Lyric,
      PlayList: themeObject.PlayList ? themeObject.PlayList(PlayList) : PlayList
    };
    class MyClass {
      // Events Group
      static playerEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting', 'error', 'stalled', 'setmedia', 'stop', 'loopchanged', 'clearmedia', 'destroy'];
      static lyricEvents = ['lyricfetched', 'timeupdated', 'reset'];
      static playlistEvents = ['shuffledchanged', 'add', 'select', 'remove', 'modechange'];
      playerClass = obj.Player;
      lyricClass = obj.Lyric;
      playlistClass = obj.PlayList;
      playerInstance;
      lyricInstance;
      playlistInstance;
      constructor(options) {
        this.playerInstance = this.playerClass ? new this.playerClass({
          ...options,
          media: Array.isArray(options.media) && options.media.length ? options.media[0] : options.media,
          container: options.container
        }) : null;
        this.lyricInstance = this.lyricClass ? new this.lyricClass({
          ...options,
          lyric: Array.isArray(options.media) && options.media.length ? options.media[0].lyric : (options.media?.lyric || ''),
          mediaObject: this.playerInstance.mediaObject,
          container: options.container
        }) : null;
        this.playlistInstance = this.playlistClass ? new this.playlistClass({
          ...options,
          container: options.container,
          list: Array.isArray(options.media) && options.media.length ? [...options.media] : [],
          player: this.playerInstance,
          lyricObj: this.lyricInstance
        }) : null;
        if (this.playerInstance) {
          ['setMedia', 'formatTime', 'play', 'playHead', 'isPlaying', 'stop', 'toggleLoop', 'pause', 'mute', 'unmute', 'volume', 'clearMedia', 'destroy'].forEach((f) => {
            this[f] = this.playerInstance[f].bind(this.playerInstance);
          });
        }
        if (this.lyricInstance) {
          ['loadLyricPlugin', 'unload'].forEach((f) => {
            this[f] = this.lyricInstance[f].bind(this.lyricInstance);
          });
        }
        if (this.playlistInstance) {
          ['shuffle', 'setPlaylist', 'add', 'select', 'remove', 'switchModes', 'setMode', 'next', 'previous', 'play', 'pause'].forEach((f) => {
            this[f] = this.playlistInstance[f].bind(this.playlistInstance);
          });
        }
        YuanPlayer.instances.push(this);
      }
      on(event: string, callback: Function) {
        if (MyClass.playerEvents.indexOf(event) > -1) {
          this.playerInstance.on(event, callback);
        } else if (MyClass.lyricEvents.indexOf(event) > -1) {
          this.lyricInstance.on(event, callback);
        } else if (MyClass.playlistEvents.indexOf(event) > -1) {
          this.playlistInstance.on(event, callback);
        }
      }
      off(event: string, callback: Function) {
        if (MyClass.playerEvents.indexOf(event) > -1) {
          this.playerInstance.off(event, callback);
        } else if (MyClass.lyricEvents.indexOf(event) > -1) {
          this.lyricInstance.off(event, callback);
        } else if (MyClass.playlistEvents.indexOf(event) > -1) {
          this.playlistInstance.off(event, callback);
        }
      }
      pauseOthers() {
        YuanPlayer.instances.forEach(instance => {
          if (instance !== this) {
            instance.pause();
          }
        })
      };
    }
    return MyClass;
  }
}

export default YuanPlayer;