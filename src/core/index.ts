import "./element-remove";
import Player from "./playerui";
import Lyric from "./lyricui";
import PlayList from "./playlistui";

const YuanPlayer = {
  Player,
  Lyric,
  PlayList,
  use: function (themeObject) {
    const obj= {
      Player: themeObject.Player ? themeObject.Player(Player) : null,
      Lyric: themeObject.Lyric ? themeObject.Lyric(Lyric) : null,
      PlayList: themeObject.PlayList ? themeObject.PlayList(PlayList) : null
    };
    class MyClass {
      constructor(options) {
        const playerInstance = obj.Player ? new obj.Player({
          media: Array.isArray(options.media) && options.media.length ? options.media[0] : options.media,
          container: options.container
        }) : null;
        const lyricInstance = obj.Lyric ? new obj.Lyric({
          lyric: Array.isArray(options.media) && options.media.length ? options.media[0].lyric : (options.media?.lyric || ''),
          mediaObject: playerInstance.mediaObject,
          container: options.container
        }) : null;
        const playListInstance = obj.PlayList ? new obj.PlayList({
          autoPlay: false,
          container: options.container,
          list: Array.isArray(options.media) && options.media.length ? [...options.media] : [],
          player: playerInstance,
          lyricObj: lyricInstance
        }) : null;
        if (playerInstance) {
          ['setMedia', 'formatTime', 'play', 'playHead', 'isPlaying', 'stop', 'toggleLoop', 'pause', 'pauseOthers', 'tellOthers', 'mute', 'unmute', 'volume', 'clearMedia', 'destroy'].forEach((f) => {
            this[f] = playerInstance[f].bind(playerInstance);
          });
        }
        if (lyricInstance) {
          ['loadLyricPlugin', 'unload'].forEach((f) => {
            this[f] = lyricInstance[f].bind(lyricInstance);
          });
        }
        if (playListInstance) {
          ['shuffle', 'setPlaylist', 'add', 'select', 'remove', 'switchModes', 'setMode', 'next', 'previous', 'play', 'pause'].forEach((f) => {
            this[f] = playListInstance[f].bind(playListInstance);
          });
        }
        // Events Group
        const playerEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting', 'error', 'stalled', 'setmedia', 'stop', 'loopchanged', 'clearmedia', 'destroy'];
        const lyricEvents = ['lyricfetched', 'timeupdated', 'reset'];
        const playlistEvents = ['shuffledchanged', 'add', 'select', 'remove', 'modechange'];
        // @ts-ignore
        this.on = function(event: string, callback: Function) {
          //
          if (playerEvents.indexOf(event) > -1) {
            playerInstance.on(event, callback);
          } else if (lyricEvents.indexOf(event) > -1) {
            lyricInstance.on(event, callback);
          } else if (playlistEvents.indexOf(event) > -1) {
            playListInstance.on(event, callback);
          }
        };
        // @ts-ignore
        this.off = function(event: string, callback: Function) {
          //
          if (playerEvents.indexOf(event) > -1) {
            playerInstance.off(event, callback);
          } else if (lyricEvents.indexOf(event) > -1) {
            lyricInstance.off(event, callback);
          } else if (playlistEvents.indexOf(event) > -1) {
            playListInstance.off(event, callback);
          }
        };
      }
    }
    return MyClass;
  }
};

export default YuanPlayer;