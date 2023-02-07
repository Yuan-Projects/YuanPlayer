import Player from "./player";
import Lyric from "./lyric";
import PlayList from "./playlist";

const YuanPlayer: any = {
  themes: {},
  Player: function (options) {
    if (options.theme && YuanPlayer.themes[options.theme]) {
      return new YuanPlayer.themes[options.theme].Player(options);
    }
  },
  Lyric: function (options) {
    if (options.theme && YuanPlayer.themes[options.theme]) {
      return new YuanPlayer.themes[options.theme].Lyric(options);
    }
  },
  PlayList: function (options) {
    if (options.theme && YuanPlayer.themes[options.theme]) {
      return new YuanPlayer.themes[options.theme].PlayList(options);
    }
  }
};

YuanPlayer.use = function (themeObject) {
  if (!YuanPlayer.themes[themeObject.name]) {
    YuanPlayer.themes[themeObject.name] = {};
  }
  if (themeObject.Player) {
    YuanPlayer.themes[themeObject.name].Player = themeObject.Player(Player);
  }
  if (themeObject.Lyric) {
    YuanPlayer.themes[themeObject.name].Lyric = themeObject.Lyric(Lyric);
  }
  if (themeObject.PlayList) {
    YuanPlayer.themes[themeObject.name].PlayList = themeObject.PlayList(PlayList);
  }
}

export default YuanPlayer;