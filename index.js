window.addEventListener("load", initAll, false);
function initAll () {
  yuanjs.id('controlbutton-container').style.display = 'block';
  yuanjs.id('time-container').style.display = 'block';
  // Webm Sample: http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm
  // MP3 Sample: http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3
  var options = {
    source:[
      // http://stream13.qqmusic.qq.com/30411231.mp3
      // http://192.168.1.101/test/to-the-future-myself.mp3
      { src: 'http://stream13.qqmusic.qq.com/30411231.mp3'}
    ],
    cssSelector: {
      'duration': '#duration-span',
      'currentTime': '#currentTime-span'
    },
    lyric: qualifyURL('to-the-future-myself.lrc')
  };

  var player = new YuanPlayer(options);

  player.on('timeupdate', function(){
    //logWidget.AddLogMessage('current:'+player.mediaObject.currentTime);
    console.log('current:'+player.mediaObject.currentTime);
  })

  player.on('error', function(){
    alert('An error occured:' + player.errorMessage);
  })

  setTimeout(function(){
    player.off('timeupdate');
  }, 5000)

  var playButton = document.getElementById('play-button');
  var pauseButton = document.getElementById('pause-button');
  var togglePlayButton = document.getElementById('toggleplay-button');
  var stopButton = document.getElementById('stop-button');
  var muteButton = document.getElementById('mute-button');
  var unmuteButton = document.getElementById('unmute-button');
  var togglemuteButton = document.getElementById('togglemute-button');
  var volumeaddButton = document.getElementById('volumeadd-button');
  var volumeminusButton = document.getElementById('volumeminus-button');

  playButton.addEventListener('click', playMedia, false);
  pauseButton.addEventListener('click', pauseMedia, false);
  togglePlayButton.addEventListener('click', togglePlayMedia, false);
  stopButton.addEventListener('click', stopMedia, false);
  muteButton.addEventListener('click', muteMedia, false);
  unmuteButton.addEventListener('click', unmuteMedia, false);
  togglemuteButton.addEventListener('click', togglemuteMedia, false);
  volumeaddButton.addEventListener('click', volumeAddMedia, false);
  volumeminusButton.addEventListener('click', volumeMinusMedia, false);


  function playMedia() {
    player.play();
  }
  function pauseMedia() {
    player.pause();
  }
  function togglePlayMedia() {
    player.togglePlay();
  }
  function stopMedia() {
    player.stop();
  }
  function muteMedia() {
    player.mute();
  }
  function unmuteMedia() {
    player.unmute();
  }
  function togglemuteMedia() {
    player.toggleMute();
  }
  function volumeAddMedia() {
    player.addVolume();
  }
  function volumeMinusMedia() {
    player.minusVolume();
  }

}
function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}