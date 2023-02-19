const YPlayerObj = YuanPlayer.use(YuanPlayerThemeYuan);
const BMPlayerObj = YuanPlayer.use(YuanPlayerThemeBlueMonday);

const { Player, Lyric, PlayList } = YuanPlayer;
const YPlayer = YPlayerObj.Player, YLyric = YPlayerObj.Lyric, YPlayList = YPlayerObj.PlayList;
const BMPlayer = BMPlayerObj.Player, BMLyric = BMPlayerObj.Lyric, BMPlayList = BMPlayerObj.PlayList;

fetchLyrics(playlist.map(item => item.lyric)).then(lyricArr => {
  lyricArr.forEach((lyric, index) => {
    playlist[index].lyric = lyric;
  })
}).then(function() { // Theme 1: Yuan
  var player3 = new YPlayer({
    media: {src: playlist[0].src},
    container: document.querySelector('#playercontainer3')
  });
  var lyric3 = new YLyric({
    lyric: playlist[0].lyric,
    mediaObject: player3.mediaObject,
    container: document.getElementById('lyriccontainer3')
  });
  lyric3.loadLyricPlugin();
  window.list3 = new YPlayList({
    container: document.getElementById('listcontainer3'),
    list: playlist,
    player: player3,
    lyricObj: lyric3
  });
}).then(() => { // Theme 2: blueMonday
  var blueMondayPlayer1 = new BMPlayer({
    media: {src: playlist[0].src},
    container: document.querySelector('#blueMondayPlayerContainer1')
  });
  var blueMondayLyric1 = new BMLyric({
    lyric: playlist[0].lyric,
    mediaObject: blueMondayPlayer1.mediaObject,
    container: document.getElementById('blueMondayPlayerContainer1')
  });
  blueMondayLyric1.loadLyricPlugin();
  window.blueMondayPlayListInstance = new BMPlayList({
    autoPlay: false,
    container: document.querySelector('#blueMondayPlayerContainer1'),
    list: playlist,
    player: blueMondayPlayer1,
    lyricObj: blueMondayLyric1
  });
});

async function fetchLyrics(urls) {
  try {
    const fetchArr = urls.map(url => {
      return fetch(url).then(res => res.text())
    });
    const lyrics = await Promise.all(fetchArr);
    return lyrics;
  } catch (err) {
    console.log(err);
  }
}