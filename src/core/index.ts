import Player from "./playerui";
import Lyric from "./lyric";
import PlayList from "./playlistui";

const YuanPlayer = {
  Player,
  Lyric,
  PlayList,
  use: function (themeObject) {
    return {
      Player: themeObject.Player ? themeObject.Player(Player) : null,
      Lyric: themeObject.Lyric ? themeObject.Lyric(Lyric) : null,
      PlayList: themeObject.PlayList ? themeObject.PlayList(PlayList) : null
    };
  }
};

export default YuanPlayer;