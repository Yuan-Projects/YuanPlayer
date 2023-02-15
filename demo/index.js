const YPlayerObj = YuanPlayer.use(YuanPlayerThemeYuan);
const BMPlayerObj = YuanPlayer.use(YuanPlayerThemeBlueMonday);

const { Player, Lyric, PlayList } = YuanPlayer;
const YPlayer = YPlayerObj.Player, YLyric = YPlayerObj.Lyric, YPlayList = YPlayerObj.PlayList;
const BMPlayer = BMPlayerObj.Player, BMLyric = BMPlayerObj.Lyric, BMPlayList = BMPlayerObj.PlayList;

var dicPlayer = new Player({
  controls: false,
  source:[
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/uk_pron/u/ukp/ukper/ukperv_027.mp3' },
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/uk_pron_ogg/u/ukp/ukper/ukperv_027.ogg' },
  ],
  container: document.querySelector('#exampleEnglishDicPlayer')
});

var dicPlayer2 = new Player({
  controls: false,
  source:[
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/us_pron/e/eus/eus73/eus73520.mp3' },
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/us_pron_ogg/e/eus/eus73/eus73520.ogg' },
  ],
  container: document.querySelector('#exampleEnglishDicPlayer2')
});

var playlist = [
  {
    title: 'Let it go',
    artist: 'Idina Menzel',
    imgUrl: 'https://y.qq.com/music/photo_new/T002R300x300M000000nmCPL1H8bES_1.jpg?max_age=2592000',
    source:[
      { src: 'media/letitgo.m4a' }
    ],
    loop: false,
    lyric: qualifyURL('lyrics/letitgo.lrc')
  },
  {
    title: '再见中国海',
    artist: '4 in love',
    imgUrl: 'http://p2.music.126.net/cbtvK52JoaIK0iZNJ2BtHQ==/109951165958877997.jpg?param=130y130',
    source:[
      { src: 'media/zaijianzhongguohai.m4a' }
    ],
    loop: false,
    lyric: qualifyURL('lyrics/zaijianzhongguohai.lrc')
  },
  {
    title: '守候',
    artist: '徐瞑蕾',
    imgUrl: 'http://p2.music.126.net/Ijvh1PFFZz_ydSUTTeWfkw==/6627856093408607.jpg?param=130y130',
    source:[
      { src: 'media/shouhou.m4a' }
    ],
    loop: false,
    lyric: qualifyURL('lyrics/shouhou.lrc')
  },
  {
    title: '給未來的自己',
    artist: '梁静茹',
    imgUrl: 'https://y.qq.com/music/photo_new/T002R300x300M000002oy2Mp3I8Rgo_1.jpg?max_age=2592000',
    source:[
      { src: 'media/1007000868010800.mp3' }
    ],
    loop: false,
    lyric: qualifyURL('lyrics/to-the-future-myself.lrc')
  }
];

fetchLyrics(playlist.map(item => item.lyric)).then(lyricArr => {
  lyricArr.forEach((lyric, index) => {
    playlist[index].lyric = lyric;
  })
}).then(function() {
  var simplePlayer = new YPlayer({
    source: playlist[0].source,
    container: document.querySelector('#simplePlayerContainer')
  });
  
  var playerWithLyric = new YPlayer({
    source: playlist[2].source,
    container: document.querySelector('#APlayerLyricContainer')
  });
  
  var lyricInstance = new YLyric({
    lyric: playlist[2].lyric,
    mediaObject: playerWithLyric.mediaObject,
    container: document.getElementById('APlayerLyricLyricContainer')
  });
  lyricInstance.loadLyricPlugin();


  var playerWithPlaylist = new YPlayer({
    source: playlist[0].source,
    container: document.querySelector('#APlayerWithPlayListContainer')
  });
  var playListInstance = new YPlayList({
    container: document.getElementById('APlayerLyricPlaylistContainer'),
    list: playlist,
    player: playerWithPlaylist
  });

  var player3 = new YPlayer({
    source: playlist[0].source,
    container: document.querySelector('#playercontainer3')
  });
  var lyric3 = new YLyric({
    lyric: playlist[0].lyric,
    mediaObject: player3.mediaObject,
    container: document.getElementById('lyriccontainer3')
  });
  lyric3.loadLyricPlugin();
  var list3 = new YPlayList({
    container: document.getElementById('listcontainer3'),
    list: playlist,
    player: player3,
    lyricObj: lyric3
  });

  var blueMondayPlayer1 = new BMPlayer({
    source: playlist[0].source,
    container: document.querySelector('#blueMondayPlayerContainer1')
  });
  var blueMondayLyric1 = new BMLyric({
    lyric: playlist[0].lyric,
    mediaObject: blueMondayPlayer1.mediaObject,
    container: document.getElementById('blueMondayLyricContainer1')
  });
  blueMondayLyric1.loadLyricPlugin();
  window.blueMondayPlayListInstance = new BMPlayList({
    container: document.getElementById('blueMondayPlayListContainer1'),
    list: playlist,
    player: blueMondayPlayer1,
    lyricObj: blueMondayLyric1
  });

});

function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}

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