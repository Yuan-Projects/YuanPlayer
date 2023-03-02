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

