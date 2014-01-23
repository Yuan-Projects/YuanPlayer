if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}
function YuanPlayer(options){
  this.container = 'yuanplayer';
  this.mediaObject = null;
  this.init(options);
}
YuanPlayer.prototype = {
  constructor: YuanPlayer,
  init: function (options) {
    this.initOptions(options);
    // If no valid container exists, we do nothing.
    if(!this.container || !document.getElementById(this.container)) return ;
    this.addMediaElement();
    this.bindMediaEvents();
  },
  initOptions: function(options) {
    for (var prop in options) {
      this[prop] = options[prop];
    }
  },
  addMediaElement: function() {
    var container = document.getElementById(this.container);
    if (container) {
      var mediaElement = document.createElement('audio');
      this.mediaObject = mediaElement;

      //mediaElement.src = this.src;
      mediaElement.controls = 'controls';

      this.addMediaSource();
      container.appendChild(mediaElement);
    }
  },
  bindMediaEvents: function() {
    var that = this;
    var media = this.mediaObject;
    if (!media) return ;
    media.addEventListener('durationchange', function(){
      if (that.cssSelector && that.cssSelector.duration) {
        document.querySelector(that.cssSelector.duration).innerText = that.formatTime(Math.floor(media.duration));
      }
    }, false);
    media.addEventListener('timeupdate', function(){
      if (that.cssSelector && that.cssSelector.currentTime) {
        document.querySelector(that.cssSelector.currentTime).innerText = that.formatTime(Math.floor(media.currentTime));
      }
    }, false);
  },
  formatTime: function(timeInSeconds) {
    var result = "";
    var seconds = Math.floor(timeInSeconds),
        hours = Math.floor(seconds / 3600),
        minutes = Math.floor((seconds - (hours * 3600)) / 60),
        seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours >0 && minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    result = hours ? (hours + ':') : '' + minutes + ':' + seconds;
    return result;
  },
  addMediaSource: function(){
    var media = this.mediaObject;
    var sources = this.source;
    if (sources) {
      this.setMedia(sources);
    }
  },
  play: function(){
    if (this.mediaObject) {
      this.mediaObject.play();
    }
  },
  togglePlay: function() {
    var media = this.mediaObject;
    if (media) {
      if (media.paused) {
        media.play();
      } else {
        media.pause();
      }
    }
  },
  stop: function(){
    var media = this.mediaObject;
    if (media) {
      media.pause();
      media.currentTime = 0;
    }
  },
  getMimeType: function (fileName) {
    var type = 'wav';
    if (fileName) {
      var fileExtension = fileName.split('.').pop();
      switch(fileExtension) {
        case 'aac':
          type = 'aac';
          break;
        case 'mp4':
        case 'm4a':
          type = 'mp4';
          break;
        case 'mp1':
        case 'mp2':
        case 'mp3':
        case 'mpg':
        case 'mpeg':
          type = 'mpeg';
          break;
        case 'oga':
        case 'ogg':
          type = 'ogg';
          break;
        case 'wav':
          type = 'wav';
          break;
        case 'webm':
          type = 'webm';
          break;
        default :
          type = 'wav';
      }
    }
    return 'audio/' + type;
  },
  pause: function(){
    var media = this.mediaObject;
    if (media) {
      media.pause();
    }
  },
  setMedia: function(mediaParam) {
    var media = this.mediaObject;
    if (!media) return;
    media.innerHTML = '';
    if (typeof mediaParam == 'string') {
      var sourceElement = document.createElement('source');
      sourceElement.src = mediaParam;
      sourceElement.type = this.getMimeType(mediaParam);
      media.appendChild(sourceElement);
    } else if (typeof mediaParam == 'object'){
      if (Array.isArray(mediaParam)) {
        for (var i = 0; i < mediaParam.length; i++) {
          this.setMediaItem(mediaParam[i]);
        }
      } else {
        this.setMediaItem(mediaParam);
      }
    }
  },
  setMediaItem: function (mediaObj) {
    var media = this.mediaObject;
    var sourceElement = document.createElement('source');
    sourceElement.src = mediaObj.src;
    sourceElement.type = mediaObj.type ? mediaObj.type : this.getMimeType(mediaObj.src);
    media.appendChild(sourceElement);
  },
  mute: function() {
    var media = this.mediaObject;
    if (media) {
      media.muted = true;;
    }
  },
  unmute: function() {
    var media = this.mediaObject;
    if (media) {
      media.muted = false;
    }
  },
  toggleMute: function() {
    var media = this.mediaObject;
    if (media) {
      media.muted = !media.muted;
    }
  },
  addVolume: function() {
    var media = this.mediaObject;
    if (media) {
      var temp = media.volume + 0.2;
      media.volume = (temp >= 1.0) ? 1.0 : (temp + 0.2);
    }
  },
  minusVolume: function() {
    var media = this.mediaObject;
    if (media) {
      var temp = media.volume - 0.2;
      media.volume = (temp >= 0.0) ? (temp - 0.2) : 0.0;
    }
  }
};