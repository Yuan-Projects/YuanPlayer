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
    if(!this.container || !document.getElementById(this.container)) {
      return ;
    }

    this.addMediaElement();

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
      if (this.mediaWidth && this.mediaHeight) {

      }
      this.addMediaSource();
      container.appendChild(mediaElement);
    }
    return this;
  },
  addMediaSource: function(){
    var media = this.mediaObject;
    var sources = this.source;
    if (sources) {
      for (var i = 0, len = sources.length; i < len; i++) {
        var sourceElement = document.createElement('source');
        if (typeof sources[i] == 'object') {
          sourceElement.src = sources[i].src;
          sourceElement.type = sources[i].type ? sources[i].type : this.getMimeType(sources[i].src);
          media.appendChild(sourceElement);
        } else if (typeof sources[i] == 'string') {
          sourceElement.src = sources[i];
          sourceElement.type = this.getMimeType(sources[i]);
        }
      }
    }
  },
  play: function(){
    if (this.mediaObject) {
      this.mediaObject.play();
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

  },
  fastforward: function(){

  },
  rewind: function(){

  },
  seek: function(){

  },
  reload: function(){

  },
  setMedia: function(){

  }
};