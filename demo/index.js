var BMPlayer = YuanPlayer.use(YuanPlayerThemeBlueMonday);
var PFPlayer = YuanPlayer.use(YuanPlayerThemePinkFlag);

window.bmplayer = new BMPlayer({
  media: playlist,
  container: document.querySelector('#blueMondayPlayerContainer1')
});

window.bmplayer2 = new BMPlayer({
  media: videolist,
  container: document.querySelector('#blueMondayPlayerContainer2')
});

// Theme: pinkFlag
window.pfPlayer1 = new PFPlayer({
  loop: 'all',
  media: {},
  container: document.querySelector('#pinkFlagPlayerContainer1')
});
window.pfPlayer2 = new PFPlayer({
  media: videolist,
  container: document.querySelector('#pinkFlagPlayerContainer2')
});

setTimeout(function() {
  pfPlayer1.setPlaylist(playlist);
});

window.radioPlayer = new PFPlayer({
  media: radioList,
  container: document.querySelector('#radioContainer1')
});
