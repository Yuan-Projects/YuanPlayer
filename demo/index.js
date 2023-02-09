YuanPlayer.use(YuanPlayerThemeYuan);
YuanPlayer.use(YuanPlayerThemeBlueMonday);

const { Player, Lyric, PlayList } = YuanPlayer;
var dicPlayer = Player({
  theme: 'yuan',
  controls: false,
  source:[
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/uk_pron/u/ukp/ukper/ukperv_027.mp3' },
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/uk_pron_ogg/u/ukp/ukper/ukperv_027.ogg' },
  ],
  container: document.querySelector('#exampleEnglishDicPlayer')
});

var dicPlayer2 = Player({
  theme: 'yuan',
  controls: false,
  source:[
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/us_pron/e/eus/eus73/eus73520.mp3' },
    { src: 'https://dictionary.cambridge.org/media/english-chinese-simplified/us_pron_ogg/e/eus/eus73/eus73520.ogg' },
  ],
  container: document.querySelector('#exampleEnglishDicPlayer2')
});

var playlist = [
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
  var simplePlayer = Player({
    theme: 'yuan',
    source: playlist[0].source,
    container: document.querySelector('#simplePlayerContainer')
  });
  
  var playerWithLyric = Player({
    theme: 'yuan',
    source: playlist[2].source,
    container: document.querySelector('#APlayerLyricContainer')
  });
  
  var lyricInstance = Lyric({
    theme: 'yuan',
    lyric: playlist[2].lyric,
    mediaObject: playerWithLyric.mediaObject,
    container: document.getElementById('APlayerLyricLyricContainer')
  });
  lyricInstance.loadLyricPlugin();


  var playerWithPlaylist = Player({
    theme: 'yuan',
    source: playlist[0].source,
    container: document.querySelector('#APlayerWithPlayListContainer')
  });
  var playListInstance = PlayList({
    theme: 'yuan',
    container: document.getElementById('APlayerLyricPlaylistContainer'),
    list: playlist,
    player: playerWithPlaylist
  });

  var player3 = Player({
    theme: 'yuan',
    source: playlist[0].source,
    container: document.querySelector('#playercontainer3')
  });
  var lyric3 = Lyric({
    theme: 'yuan',
    lyric: playlist[0].lyric,
    mediaObject: player3.mediaObject,
    container: document.getElementById('lyriccontainer3')
  });
  lyric3.loadLyricPlugin();
  var list3 = PlayList({
    theme: 'yuan',
    container: document.getElementById('listcontainer3'),
    list: playlist,
    player: player3,
    lyricObj: lyric3
  });
});

var blueMondayPlayer1 = Player({
  theme: 'blueMonday',
  source: playlist[0].source,
  container: document.querySelector('#blueMondayPlayerContainer1')
});
var playListInstance = PlayList({
  theme: 'blueMonday',
  container: document.getElementById('blueMondayPlayListContainer1'),
  list: playlist,
  player: blueMondayPlayer1
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