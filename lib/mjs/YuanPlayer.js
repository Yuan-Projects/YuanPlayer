function isArray(vArg) {
    if (Array.isArray) {
        return Array.isArray(vArg);
    }
    return Object.prototype.toString.call(vArg) === "[object Array]";
}
const isHtml5AudioSupported = function () {
    return document.createElement("audio").play;
};

class Emitter {
    constructor() {
        this.eventHandlers = {};
    }
    on(event, callback) {
        var Events = this.eventHandlers;
        if (!Events[event]) {
            Events[event] = [];
        }
        Events[event].push(callback);
    }
    off(event, callback) {
        var Events = this.eventHandlers;
        if (!Events[event])
            return;
        if (callback) {
            var index = Events[event].indexOf(callback);
            if (index !== -1) {
                Events[event].splice(index, 1);
            }
        }
        else {
            Events[event] = [];
        }
    }
    trigger(event, ...args) {
        var Events = this.eventHandlers;
        if (!Events[event])
            return;
        var callbackArray = Events[event];
        for (var i = callbackArray.length - 1; i >= 0; i--) {
            callbackArray[i].apply(callbackArray[i], args);
        }
    }
}

/**
 * Render the <audio> tag into a specific DOM element
 * And add listeners for media playback events
 * This file does not contains the player UI
 */
class Player extends Emitter {
    constructor(options) {
        super();
        this.loop = false;
        this.controls = 'default';
        if (!isHtml5AudioSupported()) {
            throw new Error("Your browser does not support HTML5 Audio.");
        }
        this.mediaObject = null;
        this.errorCode = 0;
        this.errorMessage = '';
        this.eventHandlers = {};
        this.init(options);
    }
    init(options) {
        this.initOptions(options);
        // If no valid container exists, we do nothing.
        if (!this.container)
            return;
        this.addMediaElement();
        this.bindMediaEvents();
    }
    initOptions(options) {
        for (const prop in options) {
            // @ts-ignore
            this[prop] = options[prop];
        }
    }
    addMediaElement() {
        const div = document.createElement('div');
        div.classList.add('yuan-player-container');
        var mediaElement = document.createElement('audio');
        mediaElement.preload = "metadata";
        this.mediaObject = mediaElement;
        mediaElement.controls = this.controls === 'system' || this.controls === true;
        if (typeof this.loop !== "undefined") {
            mediaElement.loop = !!this.loop;
        }
        this.addMediaSource();
        //this.container.appendChild(mediaElement);
        div.appendChild(mediaElement);
        this.container.appendChild(div);
        if (this.controls !== false) {
            div.style.display = 'box';
        }
    }
    bindMediaEvents() {
        var that = this;
        var media = this.mediaObject;
        if (!media)
            return;
        var t = window.setInterval(function () {
            if (media.networkState === 3) {
                that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
                that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
                clearInterval(t);
                that.trigger('error');
            }
        }, 100);
        media.addEventListener('abort', function () {
            that.trigger('abort');
        }, false);
        media.addEventListener('canplay', function () {
            that.trigger('canplay');
        }, false);
        media.addEventListener('canplaythrough', function () {
            that.trigger('canplaythrough');
        }, false);
        media.addEventListener('durationchange', function () {
            //updateDuration();
            that.trigger('durationchange');
        }, false);
        media.addEventListener('emptied', function () {
            that.trigger('emptied');
        }, false);
        media.addEventListener('ended', function () {
            that.trigger('ended');
        }, false);
        media.addEventListener('error', function (e) {
            switch (e.target.error.code) {
                case e.target.error.MEDIA_ERR_ABORTED:
                    that.errorCode = Player.error.MEDIA_ERR_ABORTED.code;
                    that.errorMessage = Player.error.MEDIA_ERR_ABORTED.message;
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    that.errorCode = Player.error.MEDIA_ERR_NETWORK.code;
                    that.errorMessage = Player.error.MEDIA_ERR_NETWORK.message;
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    that.errorCode = Player.error.MEDIA_ERR_DECODE.code;
                    that.errorMessage = Player.error.MEDIA_ERR_DECODE.message;
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    that.errorCode = Player.error.MEDIA_ERR_SRC_NOT_SUPPORTED.code;
                    that.errorMessage = Player.error.MEDIA_ERR_SRC_NOT_SUPPORTED.message;
                    break;
                default:
                    that.errorCode = Player.error.MEDIA_ERR_UNKNOWN.code;
                    that.errorMessage = Player.error.MEDIA_ERR_UNKNOWN.message;
                    break;
            }
            clearInterval(t);
            that.trigger('error');
        }, false);
        media.addEventListener('loadeddata', function () {
            that.trigger('loadeddata');
        }, false);
        media.addEventListener('loadedmetadata', function () {
            that.trigger('loadedmetadata');
        }, false);
        media.addEventListener('loadstart', function () {
            that.trigger('loadstart');
        }, false);
        media.addEventListener('pause', function () {
            that.trigger('pause');
        }, false);
        media.addEventListener('play', function () {
            that.trigger('play');
        }, false);
        media.addEventListener('playing', function () {
            that.trigger('playing');
        }, false);
        media.addEventListener('progress', function () {
            //updateDuration();
            that.trigger('progress');
        }, false);
        media.addEventListener('ratechange', function () {
            that.trigger('ratechange');
        }, false);
        media.addEventListener('seeked', function () {
            that.trigger('seeked');
        }, false);
        media.addEventListener('seeking', function () {
            that.trigger('seeking');
        }, false);
        // Fixes for Android 2.2,this event will be triggered in Android 2.2 when the media file load failed with HTTP status 403.
        media.addEventListener('stalled', function () {
            that.trigger('stalled');
            that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
            that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
            that.trigger('error');
            clearInterval(t);
        }, false);
        media.addEventListener('suspend', function () {
            that.trigger('suspend');
        }, false);
        media.addEventListener('timeupdate', function () {
            that.trigger('timeupdate');
        }, false);
        media.addEventListener('volumechange', function () {
            that.trigger('volumechange');
        }, false);
        media.addEventListener('waiting', function () {
            that.trigger('waiting');
        }, false);
    }
    addMediaSource() {
        var sources = this.source;
        if (sources) {
            this.setMedia(sources);
        }
    }
    setMedia(mediaParam) {
        var media = this.mediaObject;
        if (!media)
            return;
        media.innerHTML = '';
        if (typeof mediaParam === 'string') {
            var sourceElement = document.createElement('source');
            sourceElement.src = mediaParam;
            sourceElement.type = this.getMimeType(mediaParam);
            media.appendChild(sourceElement);
        }
        else if (typeof mediaParam === 'object') {
            if (isArray(mediaParam)) {
                for (var i = 0; i < mediaParam.length; i++) {
                    this.setMediaItem(mediaParam[i]);
                }
            }
            else {
                this.setMediaItem(mediaParam);
            }
        }
    }
    formatTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    play() {
        if (this.mediaObject) {
            this.mediaObject.play();
        }
    }
    isPlaying() {
        return this.mediaObject && !this.mediaObject.paused;
    }
    togglePlay() {
        var media = this.mediaObject;
        if (media) {
            if (media.paused) {
                media.play();
            }
            else {
                media.pause();
            }
        }
    }
    stop() {
        var media = this.mediaObject;
        if (media) {
            media.pause();
            media.currentTime = 0;
        }
    }
    toggleLoop() {
        var media = this.mediaObject;
        if (media) {
            media.loop = !media.loop;
        }
        this.trigger('loopchanged');
    }
    getMimeType(fileName) {
        var type = 'wav';
        if (fileName) {
            var fileExtension = fileName.split('.').pop();
            switch (fileExtension) {
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
                default:
                    type = 'wav';
            }
        }
        return 'audio/' + type;
    }
    pause() {
        var media = this.mediaObject;
        if (media) {
            media.pause();
        }
    }
    setMediaItem(mediaObj) {
        var media = this.mediaObject;
        var sourceElement = document.createElement('source');
        sourceElement.src = mediaObj.src;
        sourceElement.type = mediaObj.type ? mediaObj.type : this.getMimeType(mediaObj.src);
        media.appendChild(sourceElement);
    }
    mute() {
        var media = this.mediaObject;
        if (media) {
            media.muted = true;
        }
    }
    unmute() {
        var media = this.mediaObject;
        if (media) {
            media.muted = false;
        }
    }
    toggleMute() {
        var media = this.mediaObject;
        if (media) {
            media.muted = !media.muted;
        }
    }
    addVolume() {
        var media = this.mediaObject;
        if (media) {
            var temp = media.volume + 0.2;
            media.volume = (temp >= 1.0) ? 1.0 : temp;
        }
    }
    minusVolume() {
        var media = this.mediaObject;
        if (media) {
            var temp = media.volume - 0.2;
            media.volume = (temp >= 0.0) ? temp : 0.0;
        }
    }
}
Player.error = {
    MEDIA_ERR_URLEMPTY: {
        code: -2,
        message: 'Media playback command not possible as no media is set.'
    },
    MEDIA_ERR_UNKNOWN: {
        code: -1,
        message: 'An unknown error occurred.'
    },
    MEDIA_ERR_ABORTED: {
        code: 1,
        message: 'You aborted the video playback.'
    },
    MEDIA_ERR_NETWORK: {
        code: 2,
        message: 'A network error caused the video download to fail part-way.'
    },
    MEDIA_ERR_DECODE: {
        code: 3,
        message: 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.'
    },
    MEDIA_ERR_SRC_NOT_SUPPORTED: {
        code: 4,
        message: 'The video could not be loaded, either because the server or network failed or because the format is not supported.'
    }
};

/**
 * The Lyric panel base class.
 * It does not contain UI logic and should be extended by a theme file to implement a custom lyric panel.
 */
class Lyric extends Emitter {
    constructor(options) {
        super();
        this.lyricObj = {
            timeArray: [],
            lyricArray: []
        };
        this.lyricCurrentPosition = 0;
        this.mediaObject = options.mediaObject;
        this.lyric = options.lyric;
        this.container = options.container;
    }
    parseLyricItems(items) {
        var result = [];
        var timePattern = /\[[0-9]{2}:[0-9]{2}\.[0-9]{2,3}\]/g;
        for (var i = 0, l = items.length; i < l; i++) {
            var thisItem = items[i];
            var timeSpanArray = thisItem.match(timePattern);
            if (timeSpanArray) {
                var lyric = thisItem.split(timePattern).pop();
                for (var j = 0, len = timeSpanArray.length; j < len; j++) {
                    result.push(timeSpanArray[j] + lyric);
                }
            }
        }
        return result;
    }
    logLyricInfo(items) {
        var patt = /\[|\]/;
        for (var i = 0; i < items.length; i++) {
            var component = items[i].split(patt);
            if (component[2] === "") ;
            this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
            this.lyricObj.lyricArray.push(component[2]);
        }
    }
    compareTimeSpan(x, y) {
        var timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2,3})\]/;
        var xTime = x.match(timePattern)[1], yTime = y.match(timePattern)[1];
        var xTimeInSeconds = this.parseTimeToSeconds(xTime), yTimeInSeconds = this.parseTimeToSeconds(yTime);
        return xTimeInSeconds - yTimeInSeconds;
    }
    parseTimeToSeconds(timeString) {
        var component = timeString.split(".");
        var bigPart = component[0];
        var bigPartComponent = bigPart.split(":");
        var minutePart = parseInt(bigPartComponent[0]);
        var secondPart = parseInt(bigPartComponent[1]);
        return parseFloat(minutePart * 60 + secondPart + "." + component[1]);
    }
    addLyric() {
        var lyric = this.lyric;
        if (lyric) {
            var lyricItems = lyric.split(/[\n\r]/g);
            lyricItems = this.parseLyricItems(lyricItems);
            lyricItems.sort((x, y) => {
                return this.compareTimeSpan.call(this, x, y);
            });
            this.lyricObj.lyricArray.length = 0;
            this.lyricObj.timeArray.length = 0;
            this.lyricCurrentPosition = 0;
            this.trigger("lyricFetched", lyricItems);
            this.logLyricInfo(lyricItems);
        }
    }
    bindLyricEvents() {
        var that = this;
        var media = this.mediaObject;
        if (!media)
            return;
        media.addEventListener("timeupdate", function () {
            if (that.lyric &&
                that.lyricObj.timeArray.length &&
                that.lyricObj.lyricArray.length) {
                that.trigger("timeupdated", media.currentTime);
            }
        }, false);
    }
    getNewLyricIndex(currentTime) {
        var index = 0;
        var timeArray = this.lyricObj.timeArray;
        var timeLength = timeArray.length;
        if (timeLength) {
            if (currentTime <= timeArray[0]) {
                return 0;
            }
            if (currentTime >= timeArray[timeLength - 1]) {
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
    }
    loadLyricPlugin() {
        this.addLyric();
        this.bindLyricEvents();
    }
}

/**
 * The PlayList base class should be extended by a theme file to implement the play list UI
 */
class PlayList extends Emitter {
    constructor(options) {
        super();
        this.index = 0;
        this.list = [];
        this.modeIndex = 0;
        this.container = options.container;
        this.modeIndex = PlayList.modes.indexOf(options.loop) > -1 ? PlayList.modes.indexOf(options.loop) : 0;
        this.player = options.player;
        this.lyricObj = options.lyricObj;
        this.list = options.list;
        this.addEvents();
    }
    switchModes() {
        const newVal = (++this.modeIndex) % PlayList.modes.length;
        this.modeIndex = newVal;
        this.trigger('modeChanged');
    }
    addEvents() {
        this.player.mediaObject.addEventListener('ended', () => {
            if (PlayList.modes[this.modeIndex] === 'none') {
                // Have played the last music
                if (this.index === this.list.length - 1) {
                    // Reach the end;
                    return;
                }
                else {
                    this.index++;
                    // Play the next one in the list
                }
            }
            else if (PlayList.modes[this.modeIndex] === 'random') {
                this.index = Math.floor(Math.random() * this.list.length);
                // Play the new one
            }
            else if (PlayList.modes[this.modeIndex] === 'single') ;
            else if (PlayList.modes[this.modeIndex] === 'order') {
                if (this.index === this.list.length - 1) {
                    // Reach the end;
                    this.index = 0;
                }
                else {
                    this.index++;
                    // Play the next one in the list
                }
            }
            this.playAtIndex(this.index);
        });
    }
    playNextTrack() {
        if (this.index === this.list.length - 1)
            return false;
        this.index++;
        this.playAtIndex(this.index);
    }
    playPreviousTrack() {
        if (this.index === 0)
            return false;
        this.index--;
        this.playAtIndex(this.index);
    }
    playAtIndex(index = this.index) {
        if (this.player) {
            this.player.setMedia(this.list[index].source);
            this.player.mediaObject.load();
            this.player.play();
        }
        if (this.lyricObj) {
            this.lyricObj.lyric = this.list[index].lyric;
            this.lyricObj.addLyric();
        }
        this.trigger('playMusicAtIndex', index);
    }
}
PlayList.modes = ['none', 'single', 'random', 'order'];

const YuanPlayer = {
    themes: {},
    Player: function (options) {
        if (options.theme && YuanPlayer.themes[options.theme]) {
            return new YuanPlayer.themes[options.theme].Player(options);
        }
    },
    Lyric: function (options) {
        if (options.theme && YuanPlayer.themes[options.theme]) {
            return new YuanPlayer.themes[options.theme].Lyric(options);
        }
    },
    PlayList: function (options) {
        if (options.theme && YuanPlayer.themes[options.theme]) {
            return new YuanPlayer.themes[options.theme].PlayList(options);
        }
    }
};
YuanPlayer.use = function (themeObject) {
    if (!YuanPlayer.themes[themeObject.name]) {
        YuanPlayer.themes[themeObject.name] = {};
    }
    if (themeObject.Player) {
        YuanPlayer.themes[themeObject.name].Player = themeObject.Player(Player);
    }
    if (themeObject.Lyric) {
        YuanPlayer.themes[themeObject.name].Lyric = themeObject.Lyric(Lyric);
    }
    if (themeObject.PlayList) {
        YuanPlayer.themes[themeObject.name].PlayList = themeObject.PlayList(PlayList);
    }
};

export { YuanPlayer as default };
