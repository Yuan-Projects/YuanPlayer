var BMPlayer = YuanPlayer.use(YuanPlayerThemeBlueMonday);
var PFPlayer = YuanPlayer.use(YuanPlayerThemePinkFlag);
/*
window.noThemePlayer = new YuanPlayer({
  media: playlist[0],
  nativeControls: true,
  container: document.querySelector('#noThemeContainer')
});
*/
  window.bmplayer = new BMPlayer({
    media: playlist,
    container: document.querySelector('#blueMondayPlayerContainer1')
  });

  setTimeout(function() {
    //bmplayer.setMedia(playlist[0])
    //debugger;
    //bmplayer.setPlaylist(playlist);
  }, 1000)
  let count = 0;
/*
  bmplayer.on('pause', () => {
    debugger;
  });

  const playFn = () => {
    count++;
    debugger;
    if (count > 2) {
      bmplayer.off('play', playFn);
    }
  };
  bmplayer.on('play', playFn);
  bmplayer.on('add', (arg) => {
    debugger
  });
*/
  
  // Theme 3: pinkFlag
  window.pfPlayer1 = new PFPlayer({
    loop: 'all',
    media: {},
    container: document.querySelector('#pinkFlagPlayerContainer1')
  });

  setTimeout(function() {
    //debugger;
    pfPlayer1.setPlaylist(playlist);
    //pfPlayer1.setMedia(playlist[0])
  })

window.radioPlayer = new PFPlayer({
  media: [
    {
      src: 'https://shoutcast.hubu.fm:443',
      title: 'Hubu.FM SHOUTcast'
    },
    {
      src: 'http://188.225.87.45:8000/Svadba',
      title: 'Radio Svadba Icecast'
    },
    {
      src: 'https://hls.somafm.com/hls/groovesalad/128k/program.m3u8',
      title: 'Soma FM Groove Salad 128K AAC HLS'
    },
    {
      src: 'https://live.cgtn.com/1000/prog_index.m3u8',
      title: 'CGTV English HLS'
    },
    {
      src: 'https://l.cztvcloud.com/channels/lantian/SXshangyu3/720p.m3u8',
      title: 'Shangyu New Commercial City TV HLS'
    },
  ],
  container: document.querySelector('#radioContainer1')
});