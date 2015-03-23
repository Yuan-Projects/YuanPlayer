//window.addEventListener("load", initAll, false);
window.onload = initAll;
function initAll () {
  yuanjs.id('controlbutton-container').style.display = 'block';
  yuanjs.id('time-container').style.display = 'block';
  // Webm Sample: http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm
  // MP3 Sample: http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3
  var options = {
    source:[
      // http://stream13.qqmusic.qq.com/30411231.mp3
      // http://192.168.1.101/test/to-the-future-myself.mp3
      //http://mediaelementjs.com/media/AirReview-Landmarks-02-ChasingCorporate.mp3
      // http://listen.radionomy.com/abc-jazz
      
      { src: 'http://thirdyires.imusicapp.cn/res/thirdparty/V/1007/mp3/00/08/68/1007000868010800.mp3?deviceid=1000010404539&qd=null' }
    ],
    cssSelector: {
      'duration': '#duration-span',
      'currentTime': '#currentTime-span'
    },
    loop: true,
    lyric: qualifyURL('to-the-future-myself.lrc')
  };
  try{
    var player = new YuanPlayer(options);
    updateLoopButton();
  } catch (e) {
    alert(e.message);
    return;
  }
  

  player.on('timeupdate', function(){
    //logWidget.AddLogMessage('current:'+player.mediaObject.currentTime);
    console.log('current:'+player.mediaObject.currentTime);
  })

  player.on('error', function(){
    alert('An error occured:' + player.errorMessage);
  })
  
  player.on('loopchanged', updateLoopButton);

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
  var loopButton = document.getElementById("loop");

  playButton.addEventListener('click', playMedia, false);
  pauseButton.addEventListener('click', pauseMedia, false);
  togglePlayButton.addEventListener('click', togglePlayMedia, false);
  stopButton.addEventListener('click', stopMedia, false);
  muteButton.addEventListener('click', muteMedia, false);
  unmuteButton.addEventListener('click', unmuteMedia, false);
  togglemuteButton.addEventListener('click', togglemuteMedia, false);
  volumeaddButton.addEventListener('click', volumeAddMedia, false);
  volumeminusButton.addEventListener('click', volumeMinusMedia, false);
  loopButton.addEventListener("click", triggerLoop, false);


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
  
  function triggerLoop() {
    player.toggleLoop();
    return false;
  }
  
  function updateLoopButton(){
    var isLoop = player.mediaObject.loop;
    var loopButton = document.getElementById("loop");
    loopButton.className = isLoop ? "" : "disable";
  }

}
function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}