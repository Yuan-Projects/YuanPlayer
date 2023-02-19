'use strict';

const isHtml5AudioSupported = function () {
    return document.createElement("audio").play;
};
function uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

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
        this.nativeControls = false;
        if (!isHtml5AudioSupported()) {
            throw new Error("Your browser does not support HTML5 Audio.");
        }
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
        var mediaElement = document.createElement('audio');
        mediaElement.preload = "metadata";
        this.mediaObject = mediaElement;
        mediaElement.controls = !!this.nativeControls;
        if (typeof this.loop !== "undefined") {
            mediaElement.loop = !!this.loop;
        }
        this.addMediaSource();
        div.appendChild(mediaElement);
        this.container.appendChild(div);
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
        const mediaEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
        mediaEvents.forEach(event => {
            media.addEventListener(event, () => this.trigger(event), false);
        });
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
        // Fixes for Android 2.2,this event will be triggered in Android 2.2 when the media file load failed with HTTP status 403.
        media.addEventListener('stalled', function () {
            that.trigger('stalled');
            that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
            that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
            that.trigger('error');
            clearInterval(t);
        }, false);
    }
    addMediaSource() {
        if (!this.media || !this.media.src)
            return false;
        this.mediaObject.innerHTML = '';
        this.mediaObject.removeAttribute('src');
        let src = this.media.src;
        if (typeof src === 'string') {
            src = [src];
        }
        for (var i = 0; i < src.length; i++) {
            this.addSourceElement(src[i]);
        }
    }
    /**
     * Defines the media to play.
     * @param media
     */
    setMedia(media) {
        this.media = media;
        this.addMediaSource();
        this.mediaObject.load();
    }
    formatTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
    /**
     * Plays the media file.
     */
    play() {
        if (this.mediaObject) {
            this.mediaObject.play();
        }
    }
    /**
     * moves the play-head to a new position
     * @param percent
     */
    playHead(percent) {
        this.mediaObject.currentTime = percent * this.mediaObject.duration;
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
    /**
     * Stop the media and reset the play-head to the start of the media.
     */
    stop() {
        var media = this.mediaObject;
        if (media) {
            media.pause();
            media.currentTime = 0;
            this.trigger('stop');
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
    /**
     * Pause the media.
     */
    pause() {
        var media = this.mediaObject;
        if (media) {
            media.pause();
        }
    }
    // TODO
    pauseOthers() {
    }
    // TODO
    tellOthers() {
    }
    addSourceElement(src) {
        var sourceElement = document.createElement('source');
        sourceElement.src = src;
        sourceElement.type = this.getMimeType(src);
        this.mediaObject.appendChild(sourceElement);
    }
    /**
     * Mutes the media's sounds
     */
    mute() {
        var media = this.mediaObject;
        if (media) {
            media.muted = true;
        }
    }
    /**
     * Unmutes the media's sounds.
     */
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
    /**
     * This method is used to control the volume of the media being played.
     * Silence: 0
     * Half: 0.5
     * Maximum: 1
     * @param ratio - Number (0 to 1) defining the ratio of maximum volume.
     */
    volume(ratio) {
        this.mediaObject.volume = (ratio >= 1.0) ? 1.0 : ratio;
    }
    /**
     * This method is used to clear the media and stop playback.
     * If a media file is downloading at the time, the download will be cancelled.
     */
    clearMedia() {
        if (!this.mediaObject)
            return false;
        this.stop();
        this.mediaObject.innerHTML = '';
        this.mediaObject.src = '';
        this.trigger('clearmedia');
    }
    // TODO
    /**
     * Removes YuanPlayer.
     * All event and interface bindings created are removed.
     */
    destroy() {
        this.trigger('destroy');
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

class PlayerUI extends Player {
    constructor(options) {
        super(options);
        this.useStateClassSkin = false;
        this.cssSelectorAncestor = '';
        this.cssSelector = {
            videoPlay: ".yuan-video-play",
            play: ".yuan-play",
            pause: ".yuan-pause",
            stop: ".yuan-stop",
            seekBar: ".yuan-seek-bar",
            playBar: ".yuan-play-bar",
            mute: ".yuan-mute",
            unmute: ".yuan-unmute",
            volumeBar: ".yuan-volume-bar",
            volumeBarValue: ".yuan-volume-bar-value",
            volumeMax: ".yuan-volume-max",
            volumeValue: '.yuan-volume-value',
            playbackRateBar: ".yuan-playback-rate-bar",
            playbackRateBarValue: ".yuan-playback-rate-bar-value",
            currentTime: ".yuan-current-time",
            duration: ".yuan-duration",
            title: ".yuan-title",
            fullScreen: ".yuan-full-screen",
            restoreScreen: ".yuan-restore-screen",
            repeat: ".yuan-repeat",
            repeatOff: ".yuan-repeat-off",
            gui: ".yuan-gui",
            noSolution: ".yuan-no-solution"
        };
        this.stateClass = {
            playing: "yuan-state-playing",
            seeking: "yuan-state-seeking",
            muted: "yuan-state-muted",
            looped: "yuan-state-looped",
            fullScreen: "yuan-state-full-screen",
            noVolume: "yuan-state-no-volume"
        };
        this.cssSelectorAncestor = options.cssSelectorAncestor || `#yuan_container_${uuidv4()}`;
        this.useStateClassSkin = !!options.useStateClassSkin;
        this.cssSelector = Object.assign(Object.assign({}, this.cssSelector), options.cssSelector);
        if (!this.nativeControls) {
            this.addEventListeners();
        }
    }
    addEventListeners() {
        setTimeout(() => {
            const domElement = document.querySelector(this.cssSelectorAncestor);
            if (!domElement)
                return false;
            const clickHandler = (e) => {
                const target = e.target;
                if (this.isMatchedWithSelector(target, this.cssSelector.play)) {
                    if (this.useStateClassSkin) {
                        this.togglePlay();
                    }
                    else {
                        this.play();
                    }
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.pause)) {
                    if (this.useStateClassSkin) {
                        this.togglePlay();
                    }
                    else {
                        this.pause();
                    }
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.stop)) {
                    this.stop();
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.repeat)) {
                    // TODO
                    domElement.classList.toggle(this.stateClass.looped);
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.volumeMax)) {
                    this.volume(1);
                    this.unmute();
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.mute)) {
                    if (this.useStateClassSkin) {
                        this.toggleMute();
                    }
                    else {
                        this.mute();
                    }
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.unmute)) {
                    if (this.useStateClassSkin) {
                        this.toggleMute();
                    }
                    else {
                        this.unmute();
                    }
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.volumeBar) || this.isMatchedWithSelector(target, this.cssSelector.volumeBarValue)) {
                    if (this.cssSelector.volumeBar) {
                        const volumeSlider = domElement.querySelector(this.cssSelector.volumeBar);
                        const perc = e.offsetX / parseFloat(getComputedStyle(volumeSlider).width);
                        this.volume(perc);
                    }
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.seekBar) || this.isMatchedWithSelector(target, this.cssSelector.playBar)) {
                    if (this.cssSelector.seekBar) {
                        const seekSlider = domElement.querySelector(this.cssSelector.seekBar);
                        const perc = e.offsetX / parseFloat(getComputedStyle(seekSlider).width);
                        this.playHead(perc);
                    }
                }
            };
            domElement.addEventListener('click', clickHandler, false);
            this.on('durationchange', () => {
                if (!this.cssSelector.duration)
                    return false;
                const element = domElement.querySelector(this.cssSelector.duration);
                if (element) {
                    element.textContent = this.formatTime(Math.floor(this.mediaObject.duration));
                }
            });
            this.on('timeupdate', () => {
                const second = Math.floor(this.mediaObject.currentTime);
                if (this.cssSelector.currentTime) {
                    domElement.querySelector(this.cssSelector.currentTime).textContent = this.formatTime(second);
                }
                if (this.cssSelector.playBar) {
                    const element = domElement.querySelector(this.cssSelector.playBar);
                    if (element) {
                        const perc = isFinite(this.mediaObject.duration) ? this.mediaObject.currentTime / this.mediaObject.duration : 0;
                        element.style.width = `${perc * 100}%`;
                    }
                }
            });
            this.on('play', () => {
                domElement.classList.add(this.stateClass.playing);
            });
            this.on('pause', () => {
                domElement.classList.remove(this.stateClass.playing);
            });
            this.on('stop', () => {
                domElement.classList.remove(this.stateClass.playing);
            });
            this.on('clearmedia', () => {
                domElement === null || domElement === void 0 ? void 0 : domElement.classList.remove(this.stateClass.playing);
                if (this.cssSelector.duration) {
                    domElement.querySelector(this.cssSelector.duration).textContent = this.formatTime(0);
                }
                if (this.cssSelector.playBar) {
                    domElement.querySelector(this.cssSelector.playBar).style.width = `0%`;
                }
            });
            this.on('volumechange', () => {
                this.updateVolume();
            });
            this.updateVolume();
        }, 0);
    }
    isMatchedWithSelector(dom, cssSelector, rootElement = this.container) {
        if (!cssSelector)
            return false;
        do {
            if (dom.matches(cssSelector)) {
                return true;
            }
            dom = dom.parentNode;
        } while (dom !== rootElement);
        return false;
    }
    updateVolume() {
        const domElement = document.querySelector(this.cssSelectorAncestor);
        if (!domElement)
            return false;
        if (this.mediaObject.muted) {
            domElement.classList.add(this.stateClass.muted);
        }
        else {
            domElement.classList.remove(this.stateClass.muted);
        }
        if (this.cssSelector.volumeValue) {
            const element = domElement.querySelector(this.cssSelector.volumeValue);
            if (element) {
                element.textContent = String(Math.trunc(this.mediaObject.volume * 100));
            }
        }
        if (!this.cssSelector.volumeBarValue)
            return false;
        const ele = domElement.querySelector(this.cssSelector.volumeBarValue);
        const val = Math.trunc(this.mediaObject.volume * 100);
        if (ele) {
            ele.style.width = this.mediaObject.muted ? '0%' : val + "%";
        }
    }
}

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
        this.trigger("lyricfetched", items);
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
    reset() {
        this.lyric = '';
        this.lyricObj.lyricArray.length = 0;
        this.lyricObj.timeArray.length = 0;
        this.lyricCurrentPosition = 0;
    }
    unload() {
        this.reset();
        this.trigger('reset');
    }
}

class LyricUI extends Lyric {
    constructor(options) {
        super(options);
        this.cssSelectorAncestor = '';
        this.cssSelector = {
            item: '.yuanplayer-lyric-item',
            noContent: '.yuanplayer-lyric-empty',
        };
        this.stateClass = {
            current: "highlight",
        };
        this.cssSelectorAncestor = options.cssSelectorAncestor;
        this.cssSelector = Object.assign(Object.assign({}, this.cssSelector), options.cssSelector);
        this._addEventListeners();
    }
    _addEventListeners() {
        setTimeout(() => {
            this.on('lyricfetched', (lyricItems) => {
                this.container.querySelector(this.cssSelectorAncestor).scrollTop = 0;
                // empty previous lyric items
                this._removeAllItems();
                this._updatePanel();
            });
            this.on('timeupdated', (currentTime) => {
                this.scrollLyric(currentTime);
            });
            this.on('reset', () => {
                this._updatePanel();
            });
        }, 0);
    }
    scrollLyric(currentTime) {
        var newLyricIndex = this.getNewLyricIndex(currentTime);
        var oldPosition = this.lyricCurrentPosition;
        if (newLyricIndex === oldPosition)
            return;
        this.lyricCurrentPosition = newLyricIndex;
        // Hightlight the current lyric
        var lyricDivs = this.container.querySelectorAll(this.cssSelector.item);
        if (lyricDivs.length) {
            lyricDivs[oldPosition].classList.remove(this.stateClass.current);
            lyricDivs[newLyricIndex].classList.add(this.stateClass.current);
            // Scroll the lyrics container
            var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
            // lyric-wrapcontainer
            this.container.querySelector(this.cssSelectorAncestor).scrollTop = newScrollTop;
        }
    }
    _removeAllItems() {
        const itemElements = this.container.querySelectorAll(this.cssSelector.item);
        for (let i = 0; i < itemElements.length; i++) {
            itemElements[i].remove();
        }
    }
    _updatePanel() {
        const isEmpty = this.lyricObj.lyricArray.length === 0;
        const emptyElement = this.container.querySelector(this.cssSelector.noContent);
        if (emptyElement) {
            emptyElement.style.display = isEmpty ? 'block' : 'none';
        }
    }
}

/**
 * The PlayList base class should be extended by a theme file to implement the play list UI
 */
class PlayList extends Emitter {
    constructor(options) {
        super();
        this.autoPlay = false;
        this.enableRemoveControls = false;
        this.shuffled = false;
        this.index = 0; // current index in the list
        this.originalList = []; // Array of Objects: The original playlist
        this.list = []; // Array of Objects: The current playlist displayed (Un-shuffled or Shuffled)
        this.modeIndex = 0; // Current mode
        this.container = options.container;
        this.modeIndex = options.loop && PlayList.modes.indexOf(options.loop) > -1 ? PlayList.modes.indexOf(options.loop) : 0;
        this.player = options.player;
        this.lyricObj = options.lyricObj;
        this.setPlaylist(options.list);
        this.autoPlay = !!options.autoPlay;
        if (this.list.length) {
            if (this.autoPlay) {
                this.play(0);
            }
            else {
                this.select(0);
            }
        }
        this.addEvents();
    }
    /**
     * Tested 1
     * Shuffle the playlist.
     * Toggles shuffled setting if no param is given.
     * (playNow can only be used if the first param is given. Use shuffle(undefined,true) to toggle and play.)
     *
     * @param shuffled - True always shuffles the playlist. False will un-shuffle if it was shuffled.
     * @param playNow - Cause the first item to play automatically.
     */
    shuffle(shuffled, playNow) {
        if (this.player) {
            this.player.stop();
        }
        if (shuffled === undefined) {
            // Toggle shuffle state
            if (this.shuffled) {
                this.restoreList();
            }
            else {
                this.shuffleList();
            }
        }
        else if (shuffled === true) {
            this.shuffleList();
        }
        else {
            this.restoreList();
        }
        if (playNow) {
            this.play(0);
        }
        else {
            this.select(0);
        }
    }
    /**
     * Tested 1
     * Change the playlist.
     * @param playlist
     */
    setPlaylist(playlist) {
        this.index = 0;
        this.shuffled = false;
        this.list = [...playlist];
        this.originalList = [...playlist];
    }
    shuffleList() {
        this.list = [...this.originalList].sort(() => Math.random() - 0.5);
        this.index = 0;
        this.shuffled = true;
        if (this.player.isPlaying()) {
            this.play();
        }
        this.trigger('shuffledchanged');
    }
    restoreList() {
        this.list = [...this.originalList];
        this.index = 0;
        this.shuffled = false;
        if (this.player.isPlaying()) {
            this.play();
        }
        this.trigger('shuffledchanged');
    }
    /**
     * Tested 1
     * Add a media item to the end of the playlist.
     * @param media
     * @param playNow - If it's true, start it playing after adding it.
     */
    add(media, playNow = false) {
        this.originalList.push(media);
        this.list.push(media);
        if (playNow) {
            this.play(this.list.length - 1);
        }
        else {
            if (this.originalList.length === 1) {
                this.select(0);
            }
        }
        this.trigger('add', media);
    }
    /**
     * Tested 1
     * Selects the item in the playlist.
     * @param index - A positive index selects items from the start of the playlist while a negative index selects items from the end.
     */
    select(index = this.index) {
        index = (index < 0) ? this.originalList.length + index : index; // Negative index relates to end of array.
        if (0 <= index && index < this.list.length) {
            this.index = index;
        }
        else {
            this.index = 0;
        }
        this.trigger('select', this.index);
    }
    /**
     * Tested 1
     * Removes the item from the playlist. Removes all items if no param is given.
     * @param trackItemId - A positive index removes items from the start of the playlist while a negative index removes items from the end.
     */
    remove(index) {
        if (index === undefined) {
            this.setPlaylist([]);
        }
        else {
            index = (index < 0) ? this.originalList.length + index : index;
            if (0 <= index && index < this.list.length) {
                if (this.shuffled) {
                    const item = this.list[index];
                    this.list.splice(index, 1);
                    for (let i = 0; i < this.originalList.length; i++) {
                        if (this.originalList[i] === item) {
                            this.originalList.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    this.list.splice(index, 1);
                    this.originalList.splice(index, 1);
                }
                if (this.originalList.length) {
                    if (index === this.index) {
                        this.player.stop(); // stop current playback
                        this.index = (index < this.originalList.length) ? this.index : this.originalList.length - 1; // To cope when last element being selected when it was removed
                        this.select(this.index);
                    }
                    else if (index < this.index) {
                        this.index--;
                    }
                }
                else {
                    // no item left
                    // TODO
                    this.player.clearMedia(); // TODO
                    this.lyricObj.unload(); // TODO
                }
                this.trigger('remove', index);
            }
        }
    }
    switchModes() {
        const newVal = (++this.modeIndex) % PlayList.modes.length;
        this.modeIndex = newVal;
        this.trigger('modechange');
    }
    setMode(modeString) {
        if (PlayList.modes.includes(modeString) === false)
            return false;
        this.modeIndex = PlayList.modes.indexOf(modeString);
        this.trigger('modechange');
    }
    addEvents() {
        this.on('select', index => {
            this.updatePlayerLyric(index);
        });
        this.player.on('ended', () => {
            const mode = PlayList.modes[this.modeIndex];
            if (mode === 'off') {
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
            else if (mode === 'one') ;
            else if (mode === 'all') {
                if (this.index === this.list.length - 1) {
                    // Reach the end;
                    this.index = 0;
                }
                else {
                    this.index++;
                    // Play the next one in the list
                }
            }
            this.play(this.index);
        });
    }
    /**
     * Tested 1
     * Move to and play the next item in the playlist.
     * @returns
     */
    next() {
        if (this.index === this.list.length - 1)
            return false;
        this.index++;
        this.play(this.index);
    }
    /**
     * Tested 1
     * Move to and play the previous item in the playlist.
     * @returns
     */
    previous() {
        if (this.index === 0)
            return false;
        this.index--;
        this.play(this.index);
    }
    /**
     * Tested 1
     * Plays the item in the playlist.
     * @param index - Plays the current item if no param is given. A positive index plays items from the start of the playlist while a negative index plays items from the end.
     * @returns
     */
    play(index = this.index) {
        index = (index < 0) ? this.originalList.length + index : index;
        if (index > this.list.length - 1 || index < 0 || this.list.length === 0)
            return false;
        this.select(index);
        //this.updatePlayerLyric(index);
        if (this.player) {
            this.player.play();
        }
        // TODO
        this.trigger('play', index);
    }
    /**
     * Tested 1
     * Pause the current item.
     */
    pause() {
        if (this.player) {
            this.player.pause();
        }
    }
    playAtIndex(index = this.index) {
        if (index > this.list.length - 1)
            return false;
        this.updatePlayerLyric(index);
        if (this.player) {
            this.player.play();
        }
        this.trigger('playMusicAtIndex', index);
    }
    playTrackById(trackId) {
        const index = this.list.findIndex((track) => track.id == trackId);
        if (index > -1) {
            this.index = index;
            this.playAtIndex(index);
        }
    }
    updatePlayerLyric(index) {
        if (index > this.list.length - 1)
            return false;
        if (this.player) {
            this.player.setMedia(this.list[index]);
        }
        if (this.lyricObj) {
            this.lyricObj.lyric = this.list[index].lyric;
            this.lyricObj.addLyric();
        }
    }
}
PlayList.modes = ['off', 'one', 'all'];

class PlayListUI extends PlayList {
    constructor(options) {
        super(options);
        this.cssSelector = {
            remove: '.yuan-playlist-item-remove',
            next: '.yuan-next',
            previous: '.yuan-previous',
            shuffle: '.yuan-shuffle',
            item: '.yuan-playlist-item',
        };
        this.stateClass = {
            shuffled: "yuan-state-shuffled",
            currentItem: 'yuan-playlist-current',
        };
        this.autoPlay = !!options.autoPlay;
        this.enableRemoveControls = !!options.enableRemoveControls;
        this.cssSelector = Object.assign(Object.assign({}, this.cssSelector), options.cssSelector);
        this.stateClass = Object.assign(Object.assign({}, this.stateClass), options.stateClass);
        this._addEventListeners();
    }
    _addEventListeners() {
        setTimeout(() => {
            this.on('shuffledchanged', () => {
                var _a;
                this.container.classList.toggle(this.stateClass.shuffled);
                (_a = document.querySelector(this.player.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.classList.toggle(this.stateClass.shuffled);
            });
            this.on('modechange', () => {
                // TODO
            });
            this._highlightItem();
            this.on('remove', (index) => {
                var _a;
                (_a = this.container.querySelectorAll(this.cssSelector.item || '')[index]) === null || _a === void 0 ? void 0 : _a.remove();
                this._highlightItem();
            });
            this.on('select', (index) => {
                this._highlightItem(index);
            });
            this.container.addEventListener('click', (e) => {
                var _a, _b;
                const target = e.target;
                if (this.isMatchedWithSelector(target, this.cssSelector.remove)) {
                    const itemElement = this.findItemElement(target);
                    const index = this.findDomIndex(itemElement);
                    this.remove(index); // TODO
                }
                else if (this.isMatchedWithSelector(target, this.cssSelector.item)) {
                    const itemElement = this.findItemElement(target);
                    const index = this.findDomIndex(itemElement);
                    this.play(index); // TODO
                }
                else if (this.cssSelector.next && target.matches((_a = this.cssSelector) === null || _a === void 0 ? void 0 : _a.next)) {
                    this.next();
                }
                else if (this.cssSelector.previous && target.matches((_b = this.cssSelector) === null || _b === void 0 ? void 0 : _b.previous)) {
                    this.previous();
                }
                else if (this.cssSelector.shuffle && target.matches(this.cssSelector.shuffle)) {
                    this.shuffle();
                }
            });
        }, 0);
    }
    isMatchedWithSelector(dom, cssSelector, rootElement = this.container) {
        if (!cssSelector)
            return false;
        do {
            if (dom.matches(cssSelector)) {
                return true;
            }
            dom = dom.parentNode;
        } while (dom !== rootElement);
        return false;
    }
    findDomIndex(element) {
        const allItemElements = this.container.querySelectorAll(this.cssSelector.item || '');
        for (let i = 0; i < allItemElements.length; i++) {
            if (allItemElements[i] === element) {
                return i;
            }
        }
        return 0;
    }
    findItemElement(dom) {
        do {
            if (dom.matches(this.cssSelector.item)) {
                return dom;
            }
            dom = dom.parentNode;
        } while (dom !== this.container);
        return null;
    }
    _highlightItem(index = this.index) {
        var _a, _b;
        (_a = this.container.querySelector(this.cssSelector.item + '.' + this.stateClass.currentItem)) === null || _a === void 0 ? void 0 : _a.classList.remove(this.stateClass.currentItem || '');
        const itemElements = this.container.querySelectorAll(this.cssSelector.item || '');
        if (itemElements.length) {
            (_b = itemElements[index]) === null || _b === void 0 ? void 0 : _b.classList.add(this.stateClass.currentItem || '');
        }
    }
}

const YuanPlayer = {
    Player: PlayerUI,
    Lyric: LyricUI,
    PlayList: PlayListUI,
    use: function (themeObject) {
        return {
            Player: themeObject.Player ? themeObject.Player(PlayerUI) : null,
            Lyric: themeObject.Lyric ? themeObject.Lyric(LyricUI) : null,
            PlayList: themeObject.PlayList ? themeObject.PlayList(PlayListUI) : null
        };
    }
};

module.exports = YuanPlayer;
