/* global YuanPlayer, yuanjs */

if (typeof YuanPlayer === "function") {
  YuanPlayer.prototype.lyricObj = {
    timeArray:[],
    lyricArray: []
  };
  YuanPlayer.prototype.lyricCurrentPosition = 0;
  //YuanPlayer.prototype.addLyric();
  YuanPlayer.prototype.addLyricItems = function (items) {
    var lyricContainer = document.getElementById('lyric-container');
    var wrapContainer = document.getElementById('lyric-wrapcontainer');

    for (var i = 0, l = items.length; i < l; i++) {
      var div = document.createElement('div');
      var content = items[i].split(']')[1];
      YuanPlayer.helper.innerText(div, content);
      wrapContainer.appendChild(div);
    }
  };
  YuanPlayer.prototype.parseLyricItems = function(items) {
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
  };
  YuanPlayer.prototype.logLyricInfo = function(items){
    var patt = /\[|\]/;
    for (var i = 0; i < items.length; i++) {
      var component = items[i].split(patt);
      if (component[2] === '') {
        // If no lyric
      }
      this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
      this.lyricObj.lyricArray.push(component[2]);
    }
  };
  
  YuanPlayer.prototype.addLyric = function() {
    var that = this;
    var lyric = this.lyric;
    if (lyric) {
      if (typeof lyric === 'string') {
        // Add container for lyric
        var lyricDiv = document.createElement('div');
        var wrapContainer = document.createElement('div');
        lyricDiv.id = "lyric-container";
        wrapContainer.id = "lyric-wrapcontainer";
        document.body.appendChild(lyricDiv);
        lyricDiv.appendChild(wrapContainer);

        if (lyric.substr(0, 8) === 'https://' || lyric.substr(0, 7) === 'http://') {
          yuanjs.ajax({url:lyric, contentType: "text/plain"}).then(function(lyricText){
            var lyricItems = lyricText.responseText.split(/[\n\r]/g);
            lyricItems = that.parseLyricItems(lyricItems);
            lyricItems.sort(function(x,y){ return that.compareTimeSpan.call(that,x,y);});
            that.addLyricItems(lyricItems);
            that.logLyricInfo(lyricItems);
          },function(err){
            console.log('error:', err);
          });
        }

      }
    }
  };
  
  YuanPlayer.prototype.bindLyricEvents = function() {
    var that = this;
    var media = this.mediaObject;
    if (!media) return ;
    media.addEventListener('timeupdate', function(){
      if (that.lyric && that.lyricObj.timeArray.length && that.lyricObj.lyricArray.length) {
        that.scrollLyric(media.currentTime);
      }
    }, false);
  };
  
  YuanPlayer.prototype.scrollLyric = function(currentTime){
    var newLyricIndex = this.getNewLyricIndex(currentTime);
    var oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex === oldPosition) return ;

    this.lyricCurrentPosition = newLyricIndex;

    // Hightlight the current lyric
    var lyricDivs = document.getElementById('lyric-wrapcontainer').getElementsByTagName('div');
    lyricDivs[oldPosition].style.fontWeight =  'normal';
    lyricDivs[newLyricIndex].style.fontWeight = 'bold';
    
    // Scroll the lyrics container
    var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
    document.getElementById('lyric-container').scrollTop = newScrollTop;
  }; 
  YuanPlayer.prototype.getNewLyricIndex = function (currentTime) {
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
  };
  
  YuanPlayer.prototype.loadLyricPlugin = function() {
    this.addLyric();
    this.bindLyricEvents();
  };
          
}