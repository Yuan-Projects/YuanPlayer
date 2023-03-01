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
      options;
      constructor(options) {
        this.options = options;
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
        this.setPlaylistInstance();

        ['formatTime', 'play', 'playHead', 'isPlaying', 'stop', 'toggleLoop', 'pause', 'mute', 'unmute', 'volume', 'clearMedia', 'destroy'].forEach((f) => {
          this[f] = (...args) => {
            if (!this.playerInstance) {
              console.warn(`The player instance has not been initialized`);
              return;
            }
            return this.playerInstance[f].apply(this.playerInstance, args);
          }
        });
        
        ['loadLyricPlugin', 'unload', 'setLyric'].forEach((f) => {
          this[f] = (...args) => {
            if (!this.lyricInstance) {
              console.warn(`The lyric instance has not been initialized`);
              return;
            }
            return this.lyricInstance[f].apply(this.lyricInstance, args);
          }
        });

        ['shuffle', 'add', 'select', 'remove', 'switchModes', 'setMode', 'next', 'previous', 'playAtIndex'].forEach((f) => {
          this[f] = (...args) => {
            if (!this.playlistInstance) {
              console.warn(`The playlist instance has not been initialized`);
              return;
            }
            return this.playlistInstance[f].apply(this.playlistInstance, args);
          };
        });
        YuanPlayer.instances.push(this);
      }
      private setPlaylistInstance(options = this.options) {
        this.playlistInstance = this.playlistClass && Array.isArray(options.media) ? new this.playlistClass({
          ...options,
          container: options.container,
          list: Array.isArray(options.media) && options.media.length ? [...options.media] : [],
          player: this.playerInstance,
          lyricObj: this.lyricInstance
        }) : null;
      }
      setMedia(media) {
        if (this.playerInstance) {
          this.playerInstance.setMedia(media);
        }
        if (this.lyricInstance) {
          this.lyricInstance.setLyric(media.lyric);
        }
        if (this.playlistInstance) {
          this.playlistInstance.remove();
        }
      }
      setPlaylist(playlist) {
        if (!Array.isArray(playlist)) return;
        if (!this.playlistInstance) {
          this.setPlaylistInstance({
            ...this.options,
            media: playlist
          });
        }
        if (this.playlistInstance) {
          this.playlistInstance.setPlaylist(playlist);
        }
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