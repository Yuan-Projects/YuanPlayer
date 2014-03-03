if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}
function YuanPlayer(options){
  this.container = 'yuanplayer';
  this.mediaObject = null;
  this.lyricObj = {
    timeArray:[],
    lyricArray: []
  };
  this.eventHandlers = {};
  this.lyricCurrentPosition = 0;
  this.init(options);
}
YuanPlayer.helper = {
  innerText: function(element, text) {
    (typeof element.textContent != 'undefined') ? (element.textContent = text) : (element.innerText = text);
  }
};
YuanPlayer.prototype = {
  constructor: YuanPlayer,
  init: function (options) {
    this.initOptions(options);
    // If no valid container exists, we do nothing.
    if(!this.container || !document.getElementById(this.container)) return ;
    this.addMediaElement();
    this.bindMediaEvents();
    this.addLyric();
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

      mediaElement.controls = 'controls';

      this.addMediaSource();
      container.appendChild(mediaElement);
    }
  },
  bindMediaEvents: function() {
    var that = this;
    var media = this.mediaObject;
    if (!media) return ;
    
    function updateDuration() {
      if (that.cssSelector && that.cssSelector.duration && !isNaN(media.duration)) {
        YuanPlayer.helper.innerText(document.querySelector(that.cssSelector.duration), that.formatTime(Math.floor(media.duration)));
      }
    }
    function updateCurrentTime() {
      if (that.cssSelector && that.cssSelector.currentTime && !isNaN(media.currentTime) && !isNaN(media.duration)) {
        YuanPlayer.helper.innerText(document.querySelector(that.cssSelector.currentTime), that.formatTime(Math.floor(media.currentTime)));
      }
    }
    media.addEventListener('abort', function() { that.trigger('abort'); }, false);
    media.addEventListener('canplay', function() { that.trigger('canplay'); }, false);
    media.addEventListener('canplaythrough', function() { that.trigger('canplaythrough'); }, false);
    media.addEventListener('durationchange', function() { updateDuration(); that.trigger('durationchange'); }, false);
    media.addEventListener('emptied', function() { that.trigger('emptied'); }, false);
    media.addEventListener('ended', function() { that.trigger('ended'); }, false);
    media.addEventListener('error', function() { that.trigger('error'); }, false);
    media.addEventListener('loadeddata', function() { that.trigger('loadeddata'); }, false);
    media.addEventListener('loadedmetadata', function() { that.trigger('loadedmetadata'); }, false);
    media.addEventListener('loadstart', function() { that.trigger('loadstart'); }, false);
    media.addEventListener('pause', function() { that.trigger('pause'); }, false);
    media.addEventListener('play', function() { that.trigger('play'); }, false);
    media.addEventListener('playing', function() { that.trigger('playing'); }, false);
    media.addEventListener('progress', function() { updateDuration(); that.trigger('progress'); }, false);
    media.addEventListener('ratechange', function() { that.trigger('ratechange'); }, false);
    media.addEventListener('seeked', function() { that.trigger('seeked'); }, false);
    media.addEventListener('seeking', function() { that.trigger('seeking'); }, false);
    media.addEventListener('stalled', function() { that.trigger('stalled'); }, false);
    media.addEventListener('suspend', function() { that.trigger('suspend'); }, false);
    media.addEventListener('timeupdate', function(){
      updateCurrentTime();
      if (that.lyric && that.lyricObj.timeArray.length && that.lyricObj.lyricArray.length) {
        that.scrollLyric(media.currentTime);
      }
      that.trigger('timeupdate');
    }, false);
    media.addEventListener('volumechange', function() { that.trigger('volumechange'); }, false);
    media.addEventListener('waiting', function() { that.trigger('waiting'); }, false);
  },
  scrollLyric: function(currentTime){
    var newLyricIndex = this.getNewLyricIndex(currentTime);
    var oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex == oldPosition) return ;

    this.lyricCurrentPosition = newLyricIndex;

    // Hightlight the current lyric
    var lyricDivs = document.getElementById('lyric-wrapcontainer').getElementsByTagName('div');
    lyricDivs[oldPosition].style.fontWeight =  'normal';
    lyricDivs[newLyricIndex].style.fontWeight = 'bold';
    
    // Scroll the lyrics container
    var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
    document.getElementById('lyric-container').scrollTop = newScrollTop;
  },
  getNewLyricIndex: function (currentTime) {
    var index = 0;
    var timeArray = this.lyricObj.timeArray;
    var timeLength = timeArray.length;
    if (timeLength) {
      if(currentTime <= timeArray[0]) {
        return 0;
      }
      if(currentTime >= timeArray[timeLength-1]) {
        return timeLength - 1;
      }
      for (var i = 0; i < timeLength; i++) {
        if (currentTime <= timeArray[i]) {
          index = i - 1;
          break;
        }
      }
    }
    return index;
  },
  addLyric: function() {
    var that = this;
    var lyric = this.lyric;
    if (lyric) {
      if (typeof lyric =='string') {
        // Add container for lyric
        var lyricDiv = document.createElement('div');
        var wrapContainer = document.createElement('div');
        lyricDiv.id = "lyric-container";
        wrapContainer.id = "lyric-wrapcontainer";
        document.body.appendChild(lyricDiv);
        lyricDiv.appendChild(wrapContainer);

        if (lyric.substr(0, 8) == 'https://' || lyric.substr(0, 7) == 'http://') {
          yuanjs.ajax({url:lyric}).then(function(lyricText){
            var lyricItems = lyricText.responseText.split(/[\n\r]/g);
            lyricItems = that.parseLyricItems(lyricItems);
            lyricItems.sort(function(x,y){ return that.compareTimeSpan.call(that,x,y);});
            that.addLyricItems(lyricItems);
            that.logLyricInfo(lyricItems);
            //debugger;
          },function(err){
            console.log('error:', err);
          });
        }

      }
    }
  },
  logLyricInfo: function(items){
    var patt = /\[|\]/;
    for (var i = 0; i < items.length; i++) {
      var component = items[i].split(patt);
      if (component[2] == '') {
        // If no lyric
      }
      this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
      this.lyricObj.lyricArray.push(component[2]);
    }
  },
  compareTimeSpan: function(x,y){
    var timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2})\]/;
    var xTime = x.match(timePattern)[1], yTime = y.match(timePattern)[1];
    var xTimeInSeconds = this.parseTimeToSeconds(xTime), yTimeInSeconds = this.parseTimeToSeconds(yTime);
    //debugger;
    return xTimeInSeconds - yTimeInSeconds;
  },
  parseTimeToSeconds: function(timeString) {
    var component = timeString.split('.');
    var bigPart = component[0];
    var bigPartComponent = bigPart.split(':');
    var minutePart = parseInt(bigPartComponent[0]);
    var secondPart = parseInt(bigPartComponent[1]);
    return minutePart * 60 + secondPart + '.' + component[1];
  },
  parseLyricItems: function(items) {
    var result = [];
    var timePattern = /\[[0-9]{2}:[0-9]{2}\.[0-9]{2}\]/g;
    for(var i = 0, l = items.length; i < l; i++) {
      var thisItem = items[i];
      var timeSpanArray = thisItem.match(timePattern);
      if (timeSpanArray) {
        var lyric = thisItem.split(timePattern).pop();
        for (var j = 0, len = timeSpanArray.length; j < len; j++) {
          result.push(timeSpanArray[j]+lyric);
        }
      };
    }
    return result;
  },
  addLyricItems: function (items) {
    var lyricContainer = document.getElementById('lyric-container');
    var wrapContainer = document.getElementById('lyric-wrapcontainer');

    for (var i = 0, l = items.length; i < l; i++) {
      var div = document.createElement('div');
      var content = items[i].split(']')[1];
      YuanPlayer.helper.innerText(div, content);
      wrapContainer.appendChild(div);
    }
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
      media.volume = (temp >= 1.0) ? 1.0 : temp;
    }
  },
  minusVolume: function() {
    var media = this.mediaObject;
    if (media) {
      var temp = media.volume - 0.2;
      media.volume = (temp >= 0.0) ? temp : 0.0;
    }
  },
  on: function(event, callback) {
    var Events = this.eventHandlers;
    if (!Events[event]) {
      Events[event] = [];
    }
    Events[event].push(callback);
  },
  off: function(event, callback) {
    var Events = this.eventHandlers;
    if (!Events[event]) return ;
    if (callback) {
      var index = Events[event].indexOf(callback);
      if (index !== -1) {
        Events[event].splice(index, 1);
      }
    } else {
      Events[event] = [];
    }
  },
  trigger: function  (event) {
    var Events = this.eventHandlers;
    if (!Events[event]) return ;
    var args = Array.prototype.slice.call(arguments, 1);
    var callbackArray = Events[event];
    for (var i = callbackArray.length - 1; i >= 0; i--) {
      callbackArray[i].apply(callbackArray[i], args);
    };
  }
};