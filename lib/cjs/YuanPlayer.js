/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode && this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype].filter(Boolean));

// @ts-nocheck
function isArray(vArg) {
    if (Array.isArray) {
        return Array.isArray(vArg);
    }
    return Object.prototype.toString.call(vArg) === "[object Array]";
}
var isHtml5AudioSupported = function () {
    return !!(document.createElement("audio").play);
};
var isHtml5VideoSupported = function () {
    return !!(document.createElement("video").play);
};
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function trunc(x) {
    if ('trunc' in Math) {
        return Math.trunc(x);
    }
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
/**
 * Test whether the element would be selected by the specified CSS selector.
 * @param element - An element
 * @param selectors - A string containing valid CSS selectors to test the Element against.
 * @returns
 */
function matches(element, selectors) {
    try {
        if (element.matches) {
            return element.matches(selectors);
        }
        else if (element.msMatchesSelector) {
            return element.msMatchesSelector(selectors);
        }
        else if (element.webkitMatchesSelector) {
            return element.webkitMatchesSelector(selectors);
        }
    }
    catch (e) {
        return false;
    }
    return false;
}
function isHLSNativelySupported() {
    var videoElement = document.createElement('video');
    return videoElement.canPlayType('application/x-mpegURL') || videoElement.canPlayType('application/vnd.apple.mpegURL');
}
function isHLSJSSupported() {
    return typeof Hls === 'function' && Hls.isSupported();
}
function createElement(tag, attributes) {
    if (attributes === void 0) { attributes = {}; }
    var element = document.createElement(tag);
    for (var attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            if (attr === 'style') {
                element.style.cssText = attributes[attr];
            }
            else {
                element[attr] = attributes[attr];
            }
        }
    }
    return element;
}
function createTrackElement(trackObject) {
    var attrs = {
        "default": !!trackObject["default"],
        src: trackObject.src,
        kind: trackObject.kind || 'subtitles',
        label: trackObject.label
    };
    if (trackObject.srclang) {
        attrs.srclang = trackObject.srclang;
    }
    return createElement('track', attrs);
}
function includes(arr, searchElement) {
    if (Array.prototype.includes) {
        return arr.includes(searchElement);
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === searchElement) {
            return true;
        }
    }
    return false;
}
/**
 * Check if the browser supports the Fullscreen API
 * @returns boolean
 */
function isFullScreenEnabled() {
    return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
}
/**
 * Checks if the document is currently in fullscreen mode
 * @returns boolean
 */
function isFullScreen() {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}
/**
 * Exit full screen.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
    else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    else ;
}
function getFullScreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}
function debounce(fn, limit) {
    var timer;
    var ans = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.call.apply(fn, __spreadArray([context], args, false));
        }, limit);
    };
    ans.timer = function () {
        return timer;
    };
    return ans;
}
/**
 * Return MIME type for the media file.
 * @param fileName
 * @returns
 */
function getMediaMimeType(fileName, isVideo) {
    if (isVideo === void 0) { isVideo = false; }
    var category = isVideo ? 'video' : 'audio';
    var type = 'wav';
    if (fileName) {
        var fileExtension = fileName.split('.').pop();
        var videoElement = document.createElement('video');
        if (fileExtension === 'm3u8') {
            if (videoElement.canPlayType('application/x-mpegURL')) {
                return 'application/x-mpegURL';
            }
            else {
                return 'application/vnd.apple.mpegurl';
            }
        }
        switch (fileExtension) {
            case '3gp':
                type = '3gpp';
                break;
            case 'aac':
                category = 'audio';
                type = 'aac';
                break;
            case 'flac':
                category = 'audio';
                type = 'flac';
                break;
            case 'm4v':
            case 'm4p':
                category = 'video';
                type = 'mp4';
                break;
            case 'mp3':
                category = 'audio';
                type = 'mp3';
                break;
            case 'mp4':
                type = 'mp4';
                break;
            case 'm4a':
                category = 'audio';
                type = 'mp4';
                break;
            case 'mpg':
            case 'mpeg':
                type = 'mpeg';
                break;
            case 'oga':
                category = 'audio';
                type = 'ogg';
                break;
            case 'ogv':
                category = 'video';
                type = 'ogg';
                break;
            case 'ogg':
                type = 'ogg';
                break;
            case 'mov':
                category = 'video';
                type = 'quicktime';
                break;
            case 'webm':
                type = 'webm';
                break;
            case 'wav':
                category = 'audio';
                type = 'wav';
            default:
                type = 'wav';
                break;
        }
    }
    return "".concat(category, "/").concat(type);
}
/**
 * Convert a number in seconds into a string in the format of 'h-mm-ss'
 * @param secs - A number in seconds
 * @returns A string
 */
function formatTime(secs) {
    var minutes = Math.floor(secs / 60);
    var hours = Math.floor(minutes / 60);
    var seconds = Math.floor(secs % 60);
    var ans = [];
    if (hours > 0) {
        ans.push(String(hours));
    }
    minutes = hours > 0 ? minutes % 60 : minutes;
    var minutesStr = minutes < 10 ? "0".concat(minutes) : String(minutes);
    ans.push(minutesStr);
    var secondsStr = seconds < 10 ? "0".concat(seconds) : "".concat(seconds);
    ans.push(secondsStr);
    return ans.join(':');
}
function unlockScreenOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
    }
}
function makeLandscape() {
    if (screen.orientation && screen.orientation.lock) {
        var promise = screen.orientation.lock('landscape');
        if (promise) {
            promise.then(function () {
                //console.log("Locked to " + screen.orientation.type);
            })["catch"](function (e) {
                //console.log('Lock failed:' + e);
            });
        }
    }
}
/**
 * Check to see if a DOM element is a descendant of another DOM element.
 * @param container - The DOM element that may contain the other element.
 * @param contained - The DOM element that may be contained by (a descendant of) the other element.
 */
function contains(container, contained) {
    if (!container || !contained)
        return false;
    do {
        if (contained === container) {
            return true;
        }
        contained = contained.parentNode;
    } while (contained !== document);
    return false;
}
function getCCList(video) {
    if (!video.textTracks) {
        //console.log('Your browser does not support the TextTrack interface.');
        return [];
    }
    var list = [{
            label: 'Off',
            checked: true
        }];
    for (var i = 0; i < video.textTracks.length; i++) {
        var track = video.textTracks[i];
        if (track.mode === 'showing') {
            list[0].checked = false;
        }
        list.push({
            label: track.label || track.language,
            checked: track.mode === 'showing'
        });
    }
    return list;
}
function setActiveCC(video, value) {
    if (!video.textTracks) {
        //console.log('Your browser does not support the TextTrack interface.');
        return false;
    }
    for (var i = 0; i < video.textTracks.length; i++) {
        var track = video.textTracks[i];
        if (track.label === value || track.language === value) {
            track.mode = 'showing';
        }
        else {
            track.mode = 'hidden';
        }
    }
}
function showMouseCursor(timeout) {
    clearTimeout(timeout);
    if (document.body.style.cursor !== 'default') {
        document.body.style.cursor = 'default';
    }
}
function hideMouseCursor() {
    if (document.body.style.cursor !== 'none') {
        document.body.style.cursor = 'none';
    }
}

var Emitter = /** @class */ (function () {
    function Emitter() {
        this.eventHandlers = {};
        this.eventListeners = [];
    }
    Emitter.prototype.on = function (event, callback) {
        var Events = this.eventHandlers;
        if (!Events[event]) {
            Events[event] = [];
        }
        Events[event].push(callback);
    };
    Emitter.prototype.off = function (event, callback) {
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
    };
    Emitter.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var Events = this.eventHandlers;
        if (!Events[event])
            return;
        var callbackArray = Events[event];
        for (var i = 0; i <= callbackArray.length - 1; i++) {
            callbackArray[i].apply(callbackArray[i], args);
        }
    };
    /**
     * Attach listeners to a specific target.
     * @param target - The event target, common targets are Element, or its children, Document, and Window
     * @param type - A case-sensitive string representing the event type to listen for.
     * @param listener - The function that receives a notification when an event of the specified type occurs.
     */
    Emitter.prototype.addEventListener = function (target, type, listener) {
        target.addEventListener(type, listener);
        this.eventListeners.push([target, type, listener]);
    };
    /**
     * Removes an event listener previously registered with this.addEventListener() from the target.
     * @param target - The event target, common targets are Element, or its children, Document, and Window
     * @param type - A case-sensitive string representing the event type to listen for.
     * @param listener - The function that receives a notification when an event of the specified type occurs.
     */
    Emitter.prototype.removeEventListener = function (target, type, listener) {
        target.removeEventListener(type, listener);
        for (var i = 0; i < this.eventListeners.length; i++) {
            var _a = this.eventListeners[i], target1 = _a[0], type1 = _a[1], listener1 = _a[2];
            if (target1 === target && type1 === type && listener1 === listener) {
                this.eventListeners.splice(i, 1);
                break;
            }
        }
    };
    /**
     * Remove all event listeners attached on DOM nodes.
     */
    Emitter.prototype.removeAllEventListeners = function () {
        this.eventListeners.forEach(function (_a) {
            var target = _a[0], type = _a[1], listener = _a[2];
            target.removeEventListener(type, listener);
        });
        this.eventListeners.length = 0;
    };
    return Emitter;
}());

/**
 * The base Player class
 * This file does not contains the player UI
 */
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(options) {
        var _this = _super.call(this) || this;
        _this.errorCode = 0;
        _this.errorMessage = '';
        _this.loop = false;
        _this.nativeControls = false;
        for (var prop in options) {
            _this[prop] = prop === 'loop' ? options[prop] === 'one' : options[prop];
        }
        return _this;
    }
    /**
     * Defines the media to play.
     * @param media
     */
    Player.prototype.setMedia = function (media) {
        this.media = media;
        this.trigger('setmedia');
    };
    /**
     * Plays the media file.
     */
    Player.prototype.play = function () {
        if (this.mediaElement) {
            var playPromise = this.mediaElement.play();
            if (playPromise !== undefined) {
                playPromise.then(function () { })["catch"](function () { });
            }
        }
    };
    /**
     * moves the play-head to a new position
     * @param percent
     */
    Player.prototype.playHead = function (percent) {
        if (!this.mediaElement)
            return;
        this.mediaElement.currentTime = percent * this.mediaElement.duration;
    };
    Player.prototype.isPlaying = function () {
        return this.mediaElement && !this.mediaElement.paused;
    };
    Player.prototype.togglePlay = function () {
        var media = this.mediaElement;
        if (!media)
            return false;
        if (media.paused) {
            var playPromise = media.play();
            // The play() method returns a Promise which is resolved when playback has been successfully started.
            // Note: Browsers released before 2019 may not return a value from play().
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
            if (playPromise !== undefined) {
                playPromise.then(function () { })["catch"](function () { });
            }
        }
        else {
            media.pause();
        }
    };
    /**
     * Stop the media and reset the play-head to the start of the media.
     */
    Player.prototype.stop = function () {
        var media = this.mediaElement;
        if (media) {
            media.pause();
            media.currentTime = 0;
            this.trigger('stop');
        }
    };
    Player.prototype.toggleLoop = function () {
        var media = this.mediaElement;
        if (media) {
            media.loop = !media.loop;
        }
        this.trigger('loopchanged');
    };
    /**
     * Pause the media.
     */
    Player.prototype.pause = function () {
        var media = this.mediaElement;
        if (media) {
            media.pause();
        }
    };
    // TODO
    Player.prototype.pauseOthers = function () {
    };
    // TODO
    Player.prototype.tellOthers = function () {
    };
    /**
     * Mutes the media's sounds
     */
    Player.prototype.mute = function () {
        var media = this.mediaElement;
        if (media) {
            media.muted = true;
        }
    };
    /**
     * Unmutes the media's sounds.
     */
    Player.prototype.unmute = function () {
        var media = this.mediaElement;
        if (media) {
            media.muted = false;
        }
    };
    Player.prototype.toggleMute = function () {
        var media = this.mediaElement;
        if (media) {
            media.muted = !media.muted;
        }
    };
    /**
     * This method is used to control the volume of the media being played.
     * Silence: 0
     * Half: 0.5
     * Maximum: 1
     * @param ratio - Number (0 to 1) defining the ratio of maximum volume.
     */
    Player.prototype.volume = function (ratio) {
        if (!this.mediaElement)
            return;
        this.mediaElement.volume = (ratio >= 1.0) ? 1.0 : ratio;
    };
    /**
     * This method is used to clear the media and stop playback.
     * If a media file is downloading at the time, the download will be cancelled.
     */
    Player.prototype.clearMedia = function () {
        if (!this.mediaElement)
            return false;
        this.stop();
        this.mediaElement.innerHTML = '';
        this.mediaElement.src = '';
        this.trigger('clearmedia');
    };
    /**
     * Removes YuanPlayer.
     * All event and interface bindings created are removed.
     */
    Player.prototype.destroy = function () {
        this.clearMedia();
        this.removeAllEventListeners();
        this.eventHandlers = {};
        if (this.mediaElement) {
            this.mediaElement.remove();
        }
        this.mediaElement = null;
        this.errorCode = 0;
        this.errorMessage = '';
        this.loop = false;
        this.media = null;
        this.nativeControls = false;
        this.trigger('destroy');
    };
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
    return Player;
}(Emitter));

var PlayerUI = /** @class */ (function (_super) {
    __extends(PlayerUI, _super);
    function PlayerUI(options) {
        var _this = _super.call(this, options) || this;
        _this.useStateClassSkin = false;
        _this.cssSelectorAncestor = '';
        _this.cssSelector = {
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
            closedCaption: ".yuan-closed-caption",
            noSolution: ".yuan-no-solution"
        };
        _this.stateClass = {
            closedCaption: "yuan-state-closed-caption",
            repeatOne: "yuan-repeat-one",
            playing: "yuan-state-playing",
            seeking: "yuan-state-seeking",
            muted: "yuan-state-muted",
            looped: "yuan-state-looped",
            fullScreen: "yuan-state-full-screen",
            noVolume: "yuan-state-no-volume"
        };
        _this.handlePlaying = function (e) {
            var target = e.target;
            if (target.tagName !== 'VIDEO')
                return false;
            hideMouseCursor();
            _this.debouncedHide();
        };
        _this.handleVideoTouch = function (e) {
            e.preventDefault();
            var target = e.target;
            if (target.tagName !== 'VIDEO')
                return false;
            // show the controls
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (domElement && domElement.style.display !== 'block') {
                domElement.style.display = 'block';
            }
            if (_this.isPlaying() === false) {
                clearTimeout(_this.debouncedHide.timer());
            }
            else {
                hideMouseCursor();
                _this.debouncedHide();
            }
        };
        _this.handleClickMedia = function (e) {
            var target = e.target;
            if (target.tagName !== 'VIDEO')
                return false;
            _this.togglePlay();
            if (_this.isPlaying() === false) {
                // show the controls and will not hide them automatically
                var domElement = document.querySelector(_this.cssSelectorAncestor);
                if (domElement && domElement.style.display !== 'block') {
                    domElement.style.display = 'block';
                }
                showMouseCursor(_this.cursorTimer);
                clearTimeout(_this.debouncedHide.timer());
            }
            else {
                hideMouseCursor();
                _this.debouncedHide();
            }
        };
        _this.updateFullScreenButton = function () {
            var _a, _b, _c;
            if (!((_a = _this.cssSelector) === null || _a === void 0 ? void 0 : _a.fullScreen))
                return false;
            var fullScreenBtn = (_b = _this.container) === null || _b === void 0 ? void 0 : _b.querySelector((_c = _this.cssSelector) === null || _c === void 0 ? void 0 : _c.fullScreen);
            if (!fullScreenBtn || !isFullScreenEnabled())
                return;
            if (_this.media && _this.isVideo(_this.media)) {
                fullScreenBtn.style.display = 'inline-block';
            }
            else {
                fullScreenBtn.style.display = 'none';
            }
        };
        _this.handleGUIClick = function (e) {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            var target = e.target;
            if (_this.isMatchedWithSelector(target, _this.cssSelector.play)) {
                if (_this.useStateClassSkin) {
                    _this.togglePlay();
                }
                else {
                    _this.play();
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.pause)) {
                if (_this.useStateClassSkin) {
                    _this.togglePlay();
                }
                else {
                    _this.pause();
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.fullScreen)) {
                if (_this.useStateClassSkin) {
                    _this.handleFullscreen();
                }
                else {
                    _this.handleFullscreen(true);
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.stop)) {
                _this.stop();
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.repeat)) {
                // TODO
                if (_this.stateClass.looped) {
                    domElement.classList.toggle(_this.stateClass.looped);
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.volumeMax)) {
                _this.volume(1);
                _this.unmute();
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.mute)) {
                if (_this.useStateClassSkin) {
                    _this.toggleMute();
                }
                else {
                    _this.mute();
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.unmute)) {
                if (_this.useStateClassSkin) {
                    _this.toggleMute();
                }
                else {
                    _this.unmute();
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.volumeBar) || _this.isMatchedWithSelector(target, _this.cssSelector.volumeBarValue)) {
                if (_this.cssSelector.volumeBar) {
                    var volumeSlider = domElement.querySelector(_this.cssSelector.volumeBar);
                    var perc = e.offsetX / parseFloat(getComputedStyle(volumeSlider).width);
                    _this.volume(perc);
                }
            }
            else if (_this.isMatchedWithSelector(target, _this.cssSelector.seekBar) || _this.isMatchedWithSelector(target, _this.cssSelector.playBar)) {
                if (_this.cssSelector.seekBar) {
                    var seekSlider = domElement.querySelector(_this.cssSelector.seekBar);
                    var perc = e.offsetX / parseFloat(getComputedStyle(seekSlider).width);
                    _this.playHead(perc);
                }
            }
        };
        _this.fullscreenchangeFn = function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return false;
            var isFullScreenMode = isFullScreen();
            var fullScreenElement = getFullScreenElement();
            var restoreGUI = function (scrollIntoView) {
                var _a;
                if (scrollIntoView === void 0) { scrollIntoView = false; }
                domElement.style.display = 'block';
                _this.mediaElement.style.position = 'static';
                _this.mediaElement.style.height = 'auto';
                _this.mediaElement.style.left = 'auto';
                _this.mediaElement.style.top = 'auto';
                clearTimeout(_this.debouncedHide.timer());
                _this.removeEventListener(domElement, 'mouseenter', _this.fullScreenGUIHandler);
                _this.removeEventListener(domElement, 'mouseleave', _this.hideCssAncestor);
                if (scrollIntoView) {
                    (_a = _this.mediaElement) === null || _a === void 0 ? void 0 : _a.scrollIntoView();
                }
            };
            var bindFullScreenListeners = function () {
                domElement.style.display = 'none';
                _this.mediaElement.style.position = 'fixed';
                _this.mediaElement.style.height = '100%';
                _this.mediaElement.style.left = '0';
                _this.mediaElement.style.top = '0';
                _this.addEventListener(domElement, 'mouseenter', _this.fullScreenGUIHandler);
                _this.addEventListener(domElement, 'mouseleave', _this.hideCssAncestor);
                hideMouseCursor();
            };
            if (isFullScreenMode) { // enter fullscreen
                _this.fullScreenElement = fullScreenElement;
                // if the fullscreenchange is not triggered by current player
                // we restore the GUI of current player
                if (contains(_this.container, fullScreenElement) === false) {
                    restoreGUI(false);
                    _this.setFullscreenData(false);
                    return false;
                }
                else {
                    bindFullScreenListeners();
                    _this.setFullscreenData(true);
                    return false;
                }
            }
            else { // exit fullscreen
                if (contains(_this.container, _this.fullScreenElement)) {
                    restoreGUI(true);
                    _this.setFullscreenData(false);
                    showMouseCursor(_this.cursorTimer);
                }
                _this.fullScreenElement = null;
            }
        };
        _this.handleVideoMouseMove = function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return false;
            if (domElement.style.display !== 'block') {
                domElement.style.display = 'block';
            }
            // restore cursor
            showMouseCursor(_this.cursorTimer);
            if (_this.isPlaying() === false) {
                return false;
            }
            _this.debouncedHide();
            // goto sleep after a few moments
            _this.cursorTimer = setTimeout(function () {
                if (contains(_this.container, getFullScreenElement())) {
                    hideMouseCursor();
                }
            }, 2000);
        };
        _this.fullScreenGUIHandler = function () {
            showMouseCursor(_this.cursorTimer);
            clearTimeout(_this.debouncedHide.timer());
        };
        _this.hideCssAncestor = function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return false;
            domElement.style.display = 'none';
            // // goto sleep after a few moments
            _this.cursorTimer = setTimeout(hideMouseCursor, 2000);
        };
        _this.orientationChangeFn = function (e) {
            if (_this.isVideo(_this.media) === false)
                return;
            if (_this.isPlaying()) {
                hideMouseCursor();
                _this.debouncedHide();
            }
        };
        _this.handleDocumentScroll = function (e) {
            showMouseCursor(_this.cursorTimer);
        };
        _this.handleKeyboardEvents = function (e) {
            var _a, _b, _c, _d;
            if (((_a = _this.mediaElement) === null || _a === void 0 ? void 0 : _a.tagName) !== 'VIDEO' || isFinite((_b = _this.mediaElement) === null || _b === void 0 ? void 0 : _b.currentTime) === false || isFinite(_this.mediaElement.duration) === false)
                return false;
            if (e.key === ' ' || e.keyCode === 32) {
                _this.togglePlay();
            }
            else if (e.key === 'ArrowRight' || e.keyCode === 39) {
                if (((_c = _this.mediaElement) === null || _c === void 0 ? void 0 : _c.currentTime) + 10 < _this.mediaElement.duration) {
                    _this.mediaElement.currentTime += 10;
                }
            }
            else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
                if (((_d = _this.mediaElement) === null || _d === void 0 ? void 0 : _d.currentTime) - 10 > 0) {
                    _this.mediaElement.currentTime -= 10;
                }
            }
        };
        // If no valid container exists, we do nothing.
        if (_this.container) {
            _this.cssSelectorAncestor = options.cssSelectorAncestor || "#yuan_container_".concat(uuidv4());
            _this.useStateClassSkin = !!options.useStateClassSkin;
            _this.cssSelector = __assign(__assign({}, _this.cssSelector), options.cssSelector);
            _this.stateClass = __assign(__assign({}, _this.stateClass), options.stateClass);
            _this.debouncedHide = debounce(function () {
                var domElement = document.querySelector(_this.cssSelectorAncestor);
                if (!domElement)
                    return false;
                domElement.style.display = 'none';
            }, 2000);
            var nativeMediaSupported = (_this.isVideo(options.media) && isHtml5VideoSupported()) || (!_this.isVideo(options.media) && isHtml5AudioSupported());
            if (!_this.nativeControls) {
                // TODO: support native controls
                if (nativeMediaSupported) {
                    _this.addSyntheticEventListeners();
                    _this.setMedia(options.media); // `setMedia()` must be called after `this.addSyntheticEventListeners()`
                    _this.onReady();
                    if (_this.cssSelectorAncestor && _this.mediaElement) {
                        var guiHeight = Math.ceil(parseFloat(getComputedStyle(_this.container.querySelector(_this.cssSelectorAncestor)).height));
                        var parentNode = _this.mediaElement.parentNode;
                        if (isFinite(guiHeight) && parentNode) {
                            parentNode.style.minHeight = "".concat(guiHeight, "px");
                        }
                    }
                    _this.addEventListeners();
                    _this.updateFullScreenButton();
                }
            }
            if (!nativeMediaSupported) {
                var element = document.querySelector("".concat(_this.cssSelectorAncestor, " ").concat(_this.cssSelector.noSolution));
                if (element) {
                    element.style.display = 'block';
                }
            }
        }
        return _this;
    }
    /**
     * Add event listeners for current <audio> or <video> element.
     */
    PlayerUI.prototype.bindMediaEvents = function () {
        var _this = this;
        var that = this;
        var media = this.mediaElement;
        if (!media)
            return;
        var t = window.setInterval(function () {
            if ((media === null || media === void 0 ? void 0 : media.networkState) === 3) {
                that.errorCode = Player.error.MEDIA_ERR_URLEMPTY.code;
                that.errorMessage = Player.error.MEDIA_ERR_URLEMPTY.message;
                clearInterval(t);
                that.trigger('error');
            }
        }, 100);
        var mediaEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
        mediaEvents.forEach(function (event) {
            _this.addEventListener(media, event, function () { return _this.trigger(event); });
        });
        this.addEventListener(media, 'error', function (e) {
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
        });
        this.addEventListener(media, 'mousemove', this.handleVideoMouseMove);
        this.addEventListener(media, 'click', this.handleClickMedia);
        this.addEventListener(media, 'touchstart', this.handleVideoTouch);
        this.addEventListener(media, 'playing', this.handlePlaying);
    };
    /**
     * Create a div which contains the `<audio>` or `<video>` element.
     * @returns A div which container the `<audio>` or `<video>` element.
     */
    PlayerUI.prototype.addMediaElement = function () {
        var div = createElement('div');
        var mediaElement = this.addMediaElementTag();
        this.addMediaSource();
        this.setMediaPoster();
        this.addTextTracks();
        div.appendChild(mediaElement);
        this.container.insertAdjacentElement('afterbegin', div);
    };
    PlayerUI.prototype.setMediaPoster = function () {
        var _a;
        if (!this.mediaElement)
            return false;
        if (!((_a = this.media) === null || _a === void 0 ? void 0 : _a.poster) || this.mediaElement.tagName !== 'VIDEO') {
            this.mediaElement.removeAttribute('poster');
        }
        else {
            this.mediaElement.poster = this.media.poster;
        }
    };
    /**
     * Update the `<audio>` or `<video>` element's `<source>` elements.
     * It will remove existing `<source>` tags if any.
     */
    PlayerUI.prototype.addMediaSource = function () {
        if (!this.media || !this.media.src || !this.mediaElement)
            return false;
        this.mediaElement.innerHTML = '';
        this.mediaElement.removeAttribute('src');
        var src = this.media.src;
        if (typeof src === 'string') {
            src = [src];
        }
        for (var i = 0; i < src.length; i++) {
            this.addSourceElement(src[i], !!this.media.isVideo);
        }
    };
    PlayerUI.prototype.addTextTracks = function () {
        var _this = this;
        var _a;
        if (!this.media || isArray(this.media.tracks) === false || !this.mediaElement)
            return false;
        (_a = this.media.tracks) === null || _a === void 0 ? void 0 : _a.forEach(function (track) {
            var _a;
            (_a = _this.mediaElement) === null || _a === void 0 ? void 0 : _a.appendChild(createTrackElement(track));
        });
    };
    /**
     * Create a `<source>` element and append it to the `<audio>` or `<video>` element.
     * @param src - The media file URL
     * @param isVideo - If it's a video file
     */
    PlayerUI.prototype.addSourceElement = function (src, isVideo) {
        if (isVideo === void 0) { isVideo = false; }
        if (!this.mediaElement)
            return;
        var sourceElement = createElement('source', {
            src: this.processSrc(src),
            type: getMediaMimeType(src, isVideo)
        });
        this.mediaElement.appendChild(sourceElement);
    };
    PlayerUI.prototype.processSrc = function (src) {
        var fileExtension = src.split('.').pop();
        if (fileExtension === 'm3u8' && !isHLSNativelySupported()) {
            if (isHLSJSSupported()) {
                var hlsInstance = new Hls();
                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(this.mediaElement);
                this.hlsInstance = hlsInstance;
            }
            else {
                console.warn("HLS is not supported in your browsers. Please make sure you are using a modern browser and/or have imported hls.js correctly.");
            }
        }
        return src;
    };
    /**
     * Create a `<video>` or `<audio>` tag, and set it as `this.mediaElement` value.
     * @returns a HTMLMediaElement node.
     */
    PlayerUI.prototype.addMediaElementTag = function () {
        var _a;
        var attrs = {
            preload: "metadata",
            controls: !!this.nativeControls,
            loop: typeof this.loop !== "undefined" ? !!this.loop : false
        };
        var videoAttrs = __assign(__assign({}, attrs), { style: "width: 100%; display: block;" });
        if ((_a = this.media) === null || _a === void 0 ? void 0 : _a.poster) {
            videoAttrs.poster = this.media.poster;
        }
        var mediaElement = (this.media && this.isVideo(this.media) ? createElement('video', videoAttrs) : createElement('audio', attrs));
        this.mediaElement = mediaElement;
        return mediaElement;
    };
    /**
     * Determine if current track is a video.
     * @param media - The media object
     * @returns boolean
     */
    PlayerUI.prototype.isVideo = function (media) {
        if (!media)
            return false;
        if (typeof media.isVideo === 'boolean')
            return media.isVideo;
        var src = media.src;
        if (!src)
            return false;
        // .ogg, mp4 can be used as both video and audio
        var videoExts = ['ogm', 'ogv', 'webm', 'mp4', 'm4v'];
        var srcs = typeof src === 'string' ? [src] : src.slice(0);
        for (var i = 0; i < srcs.length; i++) {
            var ext = srcs[i].split('.').pop();
            if (includes(videoExts, ext)) {
                return true;
            }
        }
        return false;
    };
    PlayerUI.prototype.addSyntheticEventListeners = function () {
        var _this = this;
        var seekingFn = function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement || !_this.cssSelector.seekBar || !_this.stateClass.seeking)
                return;
            var element = domElement.querySelector(_this.cssSelector.seekBar);
            element === null || element === void 0 ? void 0 : element.classList.add(_this.stateClass.seeking);
        };
        var seekedFn = function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement || !_this.cssSelector.seekBar || !_this.stateClass.seeking)
                return;
            var element = domElement.querySelector(_this.cssSelector.seekBar);
            element === null || element === void 0 ? void 0 : element.classList.remove(_this.stateClass.seeking);
        };
        this.on('waiting', seekingFn);
        this.on('seeking', seekingFn);
        this.on('playing', seekedFn);
        this.on('seeked', seekedFn);
        this.on('ended', function () {
            if (!_this.stateClass.playing)
                return;
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            domElement === null || domElement === void 0 ? void 0 : domElement.classList.remove(_this.stateClass.playing);
        });
        this.on('durationchange', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!_this.cssSelector.duration)
                return false;
            var element = domElement === null || domElement === void 0 ? void 0 : domElement.querySelector(_this.cssSelector.duration);
            if (element) {
                element.textContent = formatTime(_this.mediaElement && isFinite(_this.mediaElement.duration) ? Math.floor(_this.mediaElement.duration) : 0);
            }
        });
        this.on('setmedia', function () {
            var _a;
            var expectedTag = _this.media && _this.isVideo(_this.media) ? 'video' : 'audio';
            if (!_this.mediaElement) { // The media element has not been created
                _this.addMediaElement();
                _this.bindMediaEvents();
            }
            else {
                if (_this.hlsInstance) {
                    _this.hlsInstance.detachMedia();
                    _this.hlsInstance.destroy();
                }
                // If the new media file has a different tag name, remove the existing tag, remove its event handlers,
                // Then create a new tag and add events listeners again.
                // We need to the same thing if a hls.js instance has attached to the media element,
                // because hlj.js uses `addTextTrack` to create text tracks, which cannot be removed, there's no `removeTextTrack` in HTMLVideoElement spec.
                // See https://github.com/video-dev/hls.js/issues/2198
                if (_this.mediaElement.tagName.toLowerCase() !== expectedTag || _this.hlsInstance) {
                    var div = _this.mediaElement.parentNode;
                    var i = 0;
                    while (i < _this.eventListeners.length) {
                        var _b = _this.eventListeners[i], target = _b[0], type = _b[1], listener = _b[2];
                        // Only those event handlers attached to the old tag need to be removed
                        if (target === _this.mediaElement) {
                            target.removeEventListener(type, listener);
                            _this.eventListeners.splice(i, 1);
                        }
                        else {
                            i++;
                        }
                    }
                    _this.clearMedia();
                    _this.mediaElement.remove();
                    _this.mediaElement = null;
                    _this.hlsInstance = null;
                    // add new tag
                    var mediaElement = _this.addMediaElementTag();
                    div.insertAdjacentElement('afterbegin', mediaElement);
                    _this.bindMediaEvents();
                }
                // Update `<source>` elements and load the media file
                _this.addMediaSource();
                _this.setMediaPoster();
                _this.addTextTracks();
                (_a = _this.mediaElement) === null || _a === void 0 ? void 0 : _a.load();
            }
        });
        this.on('setmedia', this.updateFullScreenButton);
        this.on('setmedia', function () {
            var _a, _b;
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!_this.cssSelector.title)
                return false;
            var element = domElement === null || domElement === void 0 ? void 0 : domElement.querySelector(_this.cssSelector.title);
            if (element) {
                element.textContent = ((_a = _this.media) === null || _a === void 0 ? void 0 : _a.title) || '';
            }
            if (((_b = _this.mediaElement) === null || _b === void 0 ? void 0 : _b.tagName) === 'AUDIO') {
                _this.handleFullscreen(false);
            }
        });
        this.on('setmedia', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return false;
            if (_this.cssSelector.currentTime) {
                domElement.querySelector(_this.cssSelector.currentTime).textContent = formatTime(0);
            }
            if (_this.cssSelector.duration) {
                domElement.querySelector(_this.cssSelector.duration).textContent = formatTime(0);
            }
        });
        this.on('setmedia', function () {
            // show the controls and will not hide them automatically
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (domElement && domElement.style.display !== 'block') {
                domElement.style.display = 'block';
            }
            showMouseCursor(_this.cursorTimer);
            clearTimeout(_this.debouncedHide.timer());
            _this.updateVolume();
            _this.updateLoopState();
            setTimeout(function () {
                _this.updateCCButton();
            });
        });
        this.on('error', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return;
            if (_this.errorCode === -2 || _this.errorCode === 4) {
                if (_this.cssSelector.currentTime) {
                    domElement.querySelector(_this.cssSelector.currentTime).textContent = formatTime(0);
                }
                if (_this.cssSelector.duration) {
                    domElement.querySelector(_this.cssSelector.duration).textContent = formatTime(0);
                }
                if (_this.cssSelector.playBar) {
                    domElement.querySelector(_this.cssSelector.playBar).style.width = "0%";
                }
            }
        });
        this.on('timeupdate', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return false;
            var second = _this.mediaElement ? Math.floor(_this.mediaElement.currentTime) : 0;
            if (_this.cssSelector.currentTime) {
                domElement.querySelector(_this.cssSelector.currentTime).textContent = formatTime(second);
            }
            if (_this.cssSelector.playBar) {
                var element = domElement.querySelector(_this.cssSelector.playBar);
                if (element) {
                    var perc = _this.mediaElement && isFinite(_this.mediaElement.duration) ? _this.mediaElement.currentTime / _this.mediaElement.duration : 0;
                    element.style.width = "".concat(perc * 100, "%");
                }
            }
        });
        this.on('play', function () {
            var _a;
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement || !_this.stateClass.playing)
                return;
            // If current src is empty, we should not add the state class
            if ((_a = _this.mediaElement) === null || _a === void 0 ? void 0 : _a.currentSrc) {
                domElement.classList.add(_this.stateClass.playing);
            }
        });
        this.on('pause', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement || !_this.stateClass.playing)
                return;
            domElement.classList.remove(_this.stateClass.playing);
            // show the controls
            domElement.style.display = 'block';
            clearTimeout(_this.debouncedHide.timer());
        });
        this.on('stop', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return;
            if (_this.stateClass.playing) {
                domElement.classList.remove(_this.stateClass.playing);
            }
            if (_this.cssSelector.currentTime) {
                domElement.querySelector(_this.cssSelector.currentTime).textContent = formatTime(0);
            }
            if (_this.cssSelector.playBar) {
                domElement.querySelector(_this.cssSelector.playBar).style.width = "0%";
            }
        });
        this.on('clearmedia', function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return;
            if (_this.stateClass.playing) {
                domElement === null || domElement === void 0 ? void 0 : domElement.classList.remove(_this.stateClass.playing);
            }
            if (_this.cssSelector.currentTime) {
                domElement.querySelector(_this.cssSelector.currentTime).textContent = formatTime(0);
            }
            if (_this.cssSelector.duration) {
                domElement.querySelector(_this.cssSelector.duration).textContent = formatTime(0);
            }
            if (_this.cssSelector.playBar) {
                domElement.querySelector(_this.cssSelector.playBar).style.width = "0%";
            }
            if (_this.cssSelector.title) {
                var element = domElement.querySelector(_this.cssSelector.title);
                if (element) {
                    element.textContent = '';
                }
            }
        });
        this.on('volumechange', function () {
            _this.updateVolume();
        });
        this.on('loopchanged', function () {
            _this.updateLoopState();
        });
    };
    PlayerUI.prototype.addEventListeners = function () {
        var domElement = document.querySelector(this.cssSelectorAncestor);
        if (!domElement)
            return false;
        if (isFullScreenEnabled()) {
            this.addEventListener(document, 'fullscreenchange', this.fullscreenchangeFn);
            this.addEventListener(document, 'webkitfullscreenchange', this.fullscreenchangeFn);
            this.addEventListener(document, 'mozfullscreenchange', this.fullscreenchangeFn);
            this.addEventListener(document, 'msfullscreenchange', this.fullscreenchangeFn);
            this.addEventListener(document, 'MSFullscreenChange', this.fullscreenchangeFn);
        }
        this.addEventListener(domElement, 'click', this.handleGUIClick);
        this.addEventListener(document, 'keydown', this.handleKeyboardEvents);
        this.addEventListener(document, 'scroll', this.handleDocumentScroll);
        if (screen.orientation) {
            this.addEventListener(screen.orientation, 'change', this.orientationChangeFn);
        }
        this.updateVolume();
        this.updateLoopState();
        this.updateCCButton();
    };
    PlayerUI.prototype.setFullscreenData = function (state) {
        var _a, _b;
        if (!this.stateClass.fullScreen)
            return;
        if (state) {
            this.container.classList.add(this.stateClass.fullScreen);
            (_a = document.querySelector(this.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.classList.add(this.stateClass.fullScreen);
        }
        else {
            this.container.classList.remove(this.stateClass.fullScreen);
            (_b = document.querySelector(this.cssSelectorAncestor)) === null || _b === void 0 ? void 0 : _b.classList.remove(this.stateClass.fullScreen);
        }
    };
    // Fullscreen
    PlayerUI.prototype.handleFullscreen = function (enterFullScreen) {
        var _a;
        var fullScreenEnabled = isFullScreenEnabled();
        // If the browser doesn't support the Fulscreen API then hide the fullscreen button
        if (!fullScreenEnabled) {
            var btn = document.querySelector(this.cssSelectorAncestor + ' ' + ((_a = this.cssSelector) === null || _a === void 0 ? void 0 : _a.fullScreen));
            if (btn) {
                btn.style.display = 'none';
            }
            console.warn('Your browser does not support the Fullscreen API.');
            return;
        }
        if (typeof enterFullScreen === 'boolean') {
            if (enterFullScreen) {
                requestFullscreen(this.container);
                makeLandscape();
            }
            else if (isFullScreen()) {
                exitFullscreen();
                unlockScreenOrientation();
            }
            return;
        }
        if (isFullScreen()) {
            exitFullscreen();
            unlockScreenOrientation();
        }
        else {
            requestFullscreen(this.container);
            makeLandscape();
        }
    };
    PlayerUI.prototype.updateLoopState = function () {
        var _a, _b, _c;
        var domElement = document.querySelector(this.cssSelectorAncestor);
        if (!domElement)
            return false;
        if (this.stateClass.looped) {
            if ((_a = this.mediaElement) === null || _a === void 0 ? void 0 : _a.loop) {
                domElement.classList.add(this.stateClass.looped);
            }
            else {
                domElement.classList.remove(this.stateClass.looped);
            }
        }
        if (this.cssSelector.repeat) {
            var repeatBtn = domElement.querySelector(this.cssSelector.repeat);
            if (repeatBtn && ((_b = this.stateClass) === null || _b === void 0 ? void 0 : _b.repeatOne)) {
                if ((_c = this.mediaElement) === null || _c === void 0 ? void 0 : _c.loop) {
                    repeatBtn.classList.add(this.stateClass.repeatOne);
                }
                else {
                    repeatBtn.classList.remove(this.stateClass.repeatOne);
                }
            }
        }
    };
    PlayerUI.prototype.isMatchedWithSelector = function (dom, cssSelector) {
        if (!cssSelector)
            return false;
        do {
            if (matches(dom, cssSelector)) {
                return true;
            }
            dom = dom.parentNode;
        } while (dom && dom !== document.querySelector(this.cssSelectorAncestor) && dom !== document);
        return false;
    };
    PlayerUI.prototype.updateVolume = function () {
        var _a, _b;
        var domElement = document.querySelector(this.cssSelectorAncestor);
        if (!domElement)
            return false;
        if (this.stateClass.muted) {
            if ((_a = this.mediaElement) === null || _a === void 0 ? void 0 : _a.muted) {
                domElement.classList.add(this.stateClass.muted);
            }
            else {
                domElement.classList.remove(this.stateClass.muted);
            }
        }
        if (this.cssSelector.volumeValue) {
            var element = domElement.querySelector(this.cssSelector.volumeValue);
            if (element) {
                element.textContent = String(trunc(this.mediaElement ? this.mediaElement.volume * 100 : 0));
            }
        }
        if (!this.cssSelector.volumeBarValue)
            return false;
        var ele = domElement.querySelector(this.cssSelector.volumeBarValue);
        var val = trunc(this.mediaElement ? this.mediaElement.volume * 100 : 0);
        if (ele) {
            ele.style.width = ((_b = this.mediaElement) === null || _b === void 0 ? void 0 : _b.muted) ? '0%' : val + "%";
        }
    };
    PlayerUI.prototype.setActiveCC = function (value) {
        setActiveCC(this.mediaElement, value);
    };
    PlayerUI.prototype.getCCList = function () {
        return getCCList(this.mediaElement);
    };
    PlayerUI.prototype.updateCCButton = function () {
        var _a, _b, _c;
        if (!this.cssSelector.closedCaption)
            return;
        var element = this.container.querySelector(this.cssSelectorAncestor + ' ' + this.cssSelector.closedCaption);
        if (!element)
            return;
        if (!this.mediaElement || ((_a = this.mediaElement) === null || _a === void 0 ? void 0 : _a.tagName) !== "VIDEO") {
            element.style.display = 'none';
        }
        else {
            var ccList = this.getCCList();
            if (ccList.length < 2) { // No .vtt files provided or not supported by current browser
                element.style.display = 'none';
            }
            else {
                element.style.display = 'inline-block';
                if (this.stateClass.closedCaption) {
                    if (ccList[0].checked === true) { // CC is turned off
                        this.container.classList.remove(this.stateClass.closedCaption);
                        (_b = this.container.querySelector(this.cssSelectorAncestor)) === null || _b === void 0 ? void 0 : _b.classList.remove(this.stateClass.closedCaption);
                    }
                    else {
                        this.container.classList.add(this.stateClass.closedCaption);
                        (_c = this.container.querySelector(this.cssSelectorAncestor)) === null || _c === void 0 ? void 0 : _c.classList.add(this.stateClass.closedCaption);
                    }
                }
            }
        }
    };
    return PlayerUI;
}(Player));

/**
 * The Lyric panel base class.
 * It does not contain UI logic and should be extended by a theme file to implement a custom lyric panel.
 */
var Lyric = /** @class */ (function (_super) {
    __extends(Lyric, _super);
    function Lyric(options) {
        var _this = _super.call(this) || this;
        _this.lyricObj = {
            timeArray: [],
            lyricArray: []
        };
        _this.lyricCurrentPosition = 0;
        _this.mediaElement = options.mediaElement;
        _this.lyric = options.lyric;
        _this.container = options.container;
        _this.player = options.player;
        return _this;
    }
    Lyric.prototype.parseLyricItems = function (items) {
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
    };
    Lyric.prototype.logLyricInfo = function (items) {
        var patt = /\[|\]/;
        for (var i = 0; i < items.length; i++) {
            var component = items[i].split(patt);
            if (component[2] === "") ;
            this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
            this.lyricObj.lyricArray.push(component[2]);
        }
        this.trigger("lyricfetched", items);
    };
    Lyric.prototype.compareTimeSpan = function (x, y) {
        var timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2,3})\]/;
        var xTime = x.match(timePattern)[1], yTime = y.match(timePattern)[1];
        var xTimeInSeconds = this.parseTimeToSeconds(xTime), yTimeInSeconds = this.parseTimeToSeconds(yTime);
        return xTimeInSeconds - yTimeInSeconds;
    };
    Lyric.prototype.parseTimeToSeconds = function (timeString) {
        var component = timeString.split(".");
        var bigPart = component[0];
        var bigPartComponent = bigPart.split(":");
        var minutePart = parseInt(bigPartComponent[0]);
        var secondPart = parseInt(bigPartComponent[1]);
        return parseFloat(minutePart * 60 + secondPart + "." + component[1]);
    };
    Lyric.prototype.addLyric = function () {
        var _this = this;
        var lyric = this.lyric;
        if (lyric) {
            var lyricItems = lyric.split(/[\n\r]/g);
            lyricItems = this.parseLyricItems(lyricItems);
            lyricItems.sort(function (x, y) {
                return _this.compareTimeSpan.call(_this, x, y);
            });
            this.lyricObj.lyricArray.length = 0;
            this.lyricObj.timeArray.length = 0;
            this.lyricCurrentPosition = 0;
            this.logLyricInfo(lyricItems);
        }
    };
    Lyric.prototype.bindLyricEvents = function () {
        var that = this;
        var media = this.mediaElement;
        if (!media)
            return;
        // TODO
        this.player.addEventListener(media, "timeupdate", function () {
            if (that.lyric &&
                that.lyricObj.timeArray.length &&
                that.lyricObj.lyricArray.length) {
                that.trigger("timeupdated", media.currentTime);
            }
        });
    };
    Lyric.prototype.getNewLyricIndex = function (currentTime) {
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
    };
    Lyric.prototype.loadLyricPlugin = function () {
        this.addLyric();
        this.bindLyricEvents();
    };
    Lyric.prototype.setLyric = function (lyric) {
        this.lyric = lyric;
        this.addLyric();
    };
    Lyric.prototype.unload = function () {
        this.lyric = '';
        this.lyricObj.lyricArray.length = 0;
        this.lyricObj.timeArray.length = 0;
        this.lyricCurrentPosition = 0;
        this.trigger('reset');
    };
    Lyric.prototype.destroy = function () {
        this.unload();
        this.removeAllEventListeners();
    };
    return Lyric;
}(Emitter));

var LyricUI = /** @class */ (function (_super) {
    __extends(LyricUI, _super);
    function LyricUI(options) {
        var _this = _super.call(this, options) || this;
        _this.cssSelectorAncestor = '';
        _this.cssSelector = {
            item: '.yuanplayer-lyric-item',
            noContent: '.yuanplayer-lyric-empty'
        };
        _this.stateClass = {
            empty: 'empty',
            current: "highlight"
        };
        _this.cssSelectorAncestor = options.cssSelectorAncestor;
        _this.cssSelector = __assign(__assign({}, _this.cssSelector), options.cssSelector);
        _this.addEventListeners();
        setTimeout(function () {
            _this.loadLyricPlugin();
        }, 0);
        return _this;
    }
    LyricUI.prototype.addEventListeners = function () {
        var _this = this;
        setTimeout(function () {
            _this.on('lyricfetched', function (lyricItems) {
                var _a;
                // @ts-ignore
                (_a = _this.container.querySelector(_this.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.scrollTop = 0;
                // empty previous lyric items
                _this._removeAllItems();
                if (_this.addLyricItems) {
                    _this.addLyricItems(lyricItems);
                }
                _this._updatePanel();
            });
            _this.on('timeupdated', function (currentTime) {
                _this.scrollLyric(currentTime);
            });
            _this.on('reset', function () {
                _this._updatePanel();
            });
        }, 0);
    };
    LyricUI.prototype.scrollLyric = function (currentTime) {
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
    };
    LyricUI.prototype._removeAllItems = function () {
        var itemElements = this.container.querySelectorAll(this.cssSelector.item);
        for (var i = 0; i < itemElements.length; i++) {
            itemElements[i].remove();
        }
    };
    LyricUI.prototype._updatePanel = function () {
        var _a, _b;
        var isEmpty = this.lyricObj.lyricArray.length === 0;
        var emptyElement = this.container.querySelector(this.cssSelector.noContent);
        if (isEmpty) {
            this._removeAllItems();
            (_a = this.container.querySelector(this.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.classList.add(this.stateClass.empty);
        }
        else {
            (_b = this.container.querySelector(this.cssSelectorAncestor)) === null || _b === void 0 ? void 0 : _b.classList.remove(this.stateClass.empty);
        }
        if (emptyElement) {
            emptyElement.style.display = isEmpty ? 'block' : 'none';
        }
    };
    return LyricUI;
}(Lyric));

/**
 * The PlayList base class should be extended by a theme file to implement the play list UI
 */
var PlayList = /** @class */ (function (_super) {
    __extends(PlayList, _super);
    function PlayList(options) {
        var _this = _super.call(this) || this;
        _this.autoPlay = false;
        _this.enableRemoveControls = false;
        _this.shuffled = false;
        _this.index = 0; // current index in the list
        _this.originalList = []; // Array of Objects: The original playlist
        _this.list = []; // Array of Objects: The current playlist displayed (Un-shuffled or Shuffled)
        _this.modeIndex = 0; // Current mode
        _this.container = options.container;
        _this.modeIndex = options.loop && PlayList.modes.indexOf(options.loop) > -1 ? PlayList.modes.indexOf(options.loop) : 0;
        _this.player = options.player;
        _this.lyricObj = options.lyricObj;
        _this.setPlaylist(options.list);
        _this.autoPlay = !!options.autoPlay;
        if (_this.list.length) {
            if (_this.autoPlay) {
                _this.play(0);
            }
            else {
                _this.select(0);
            }
        }
        return _this;
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
    PlayList.prototype.shuffle = function (shuffled, playNow) {
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
        this.trigger('playlistset');
        if (playNow) {
            this.play(0);
        }
        else {
            this.select(0);
        }
    };
    /**
     * Tested 1
     * Change the playlist.
     * @param playlist
     */
    PlayList.prototype.setPlaylist = function (playlist) {
        this.index = 0;
        this.shuffled = false;
        this.list = __spreadArray([], playlist, true);
        this.originalList = __spreadArray([], playlist, true);
        this.trigger('playlistset');
        if (this.list.length) {
            this.select(0);
        }
    };
    PlayList.prototype.shuffleList = function () {
        this.list = __spreadArray([], this.originalList, true).sort(function () { return Math.random() - 0.5; });
        this.index = 0;
        this.shuffled = true;
        if (this.player.isPlaying()) {
            this.play();
        }
        this.trigger('shuffledchanged');
    };
    PlayList.prototype.restoreList = function () {
        this.list = __spreadArray([], this.originalList, true);
        this.index = 0;
        this.shuffled = false;
        if (this.player.isPlaying()) {
            this.play();
        }
        this.trigger('shuffledchanged');
    };
    /**
     * Tested 1
     * Add a media item to the end of the playlist.
     * @param media
     * @param playNow - If it's true, start it playing after adding it.
     */
    PlayList.prototype.add = function (media, playNow) {
        if (playNow === void 0) { playNow = false; }
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
    };
    /**
     * Tested 1
     * Selects the item in the playlist.
     * @param index - A positive index selects items from the start of the playlist while a negative index selects items from the end.
     */
    PlayList.prototype.select = function (index) {
        if (index === void 0) { index = this.index; }
        index = (index < 0) ? this.originalList.length + index : index; // Negative index relates to end of array.
        if (0 <= index && index < this.list.length) {
            this.index = index;
        }
        else {
            this.index = 0;
        }
        this.trigger('select', this.index);
    };
    /**
     * Tested 1
     * Removes the item from the playlist. Removes all items if no param is given.
     * @param trackItemId - A positive index removes items from the start of the playlist while a negative index removes items from the end.
     */
    PlayList.prototype.remove = function (index) {
        if (index === undefined) {
            this.setPlaylist([]);
        }
        else {
            index = (index < 0) ? this.originalList.length + index : index;
            if (0 <= index && index < this.list.length) {
                if (this.shuffled) {
                    var item = this.list[index];
                    this.list.splice(index, 1);
                    for (var i = 0; i < this.originalList.length; i++) {
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
                    if (this.lyricObj) {
                        this.lyricObj.unload();
                    }
                }
                this.trigger('remove', index);
            }
        }
    };
    PlayList.prototype.switchModes = function () {
        var newVal = (++this.modeIndex) % PlayList.modes.length;
        this.modeIndex = newVal;
        this.trigger('modechange');
    };
    PlayList.prototype.setMode = function (modeString) {
        if (PlayList.modes.indexOf(modeString) === -1)
            return false;
        this.modeIndex = PlayList.modes.indexOf(modeString);
        this.trigger('modechange');
    };
    /**
     * Tested 1
     * Move to and play the next item in the playlist.
     * @returns
     */
    PlayList.prototype.next = function () {
        if (this.index === this.list.length - 1)
            return false;
        this.play(this.index + 1);
    };
    /**
     * Tested 1
     * Move to and play the previous item in the playlist.
     * @returns
     */
    PlayList.prototype.previous = function () {
        if (this.index === 0)
            return false;
        this.play(this.index - 1);
    };
    /**
     * Tested 1
     * Plays the item in the playlist.
     * @param index - Plays the current item if no param is given. A positive index plays items from the start of the playlist while a negative index plays items from the end.
     * @returns
     */
    PlayList.prototype.play = function (index) {
        if (index === void 0) { index = this.index; }
        index = (index < 0) ? this.originalList.length + index : index;
        if (index > this.list.length - 1 || index < 0 || this.list.length === 0)
            return false;
        if (index !== this.index) {
            this.select(index);
        }
        if (this.player) {
            this.player.play();
        }
    };
    PlayList.prototype.playAtIndex = function (index) {
        if (index === void 0) { index = this.index; }
        this.play(index);
    };
    /**
     * Tested 1
     * Pause the current item.
     */
    PlayList.prototype.pause = function () {
        if (this.player) {
            this.player.pause();
        }
    };
    PlayList.prototype.destroy = function () {
        this.remove();
        this.trigger('destroy');
    };
    PlayList.modes = ['off', 'one', 'all'];
    return PlayList;
}(Emitter));

var PlayListUI = /** @class */ (function (_super) {
    __extends(PlayListUI, _super);
    function PlayListUI(options) {
        var _this = _super.call(this, options) || this;
        _this.cssSelectorAncestor = '';
        _this.cssSelector = {
            remove: '.yuan-playlist-item-remove',
            next: '.yuan-next',
            previous: '.yuan-previous',
            shuffle: '.yuan-shuffle',
            item: '.yuan-playlist-item'
        };
        _this.stateClass = {
            shuffled: "yuan-state-shuffled",
            currentItem: 'yuan-playlist-current'
        };
        _this.addEvents();
        _this.autoPlay = !!options.autoPlay;
        _this.enableRemoveControls = !!options.enableRemoveControls;
        _this.cssSelectorAncestor = options.cssSelectorAncestor || '';
        _this.cssSelector = __assign(__assign({}, _this.cssSelector), options.cssSelector);
        _this.stateClass = __assign(__assign({}, _this.stateClass), options.stateClass);
        _this === null || _this === void 0 ? void 0 : _this.onReady();
        _this._addEventListeners();
        return _this;
    }
    PlayListUI.prototype.addEvents = function () {
        var _this = this;
        this.on('destroy', function () {
            var _a;
            _this.removeAllEventListeners();
            if (_this.cssSelectorAncestor) {
                (_a = _this.container.querySelector(_this.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.remove();
            }
        });
        this.on('add', function (args) {
            if (_this.onAdd) {
                _this.onAdd(args);
            }
        });
        this.on('playlistset', function () {
            _this.onListUpdated();
        });
        this.on('select', function (index) {
            _this.updatePlayerLyric(index);
            _this.highlightItem(index);
            _this.updateRepeatButtonState();
        });
        this.player.on('ended', function () {
            var mode = PlayList.modes[_this.modeIndex];
            var index = -1;
            if (mode === 'off') {
                // Have played the last music
                if (_this.index === _this.list.length - 1) {
                    // Reach the end;
                    return;
                }
                else {
                    index = _this.index + 1;
                    // Play the next one in the list
                }
            }
            else if (mode === 'one') {
                // Play current one
                index = _this.index;
            }
            else if (mode === 'all') {
                if (_this.index === _this.list.length - 1) {
                    // Reach the end;
                    index = 0;
                }
                else {
                    index = _this.index + 1;
                    // Play the next one in the list
                }
            }
            if (index > -1) {
                _this.play(index);
            }
        });
    };
    PlayListUI.prototype.updatePlayerLyric = function (index) {
        if (index > this.list.length - 1)
            return false;
        if (this.player) {
            this.player.setMedia(this.list[index]);
        }
        if (this.lyricObj) {
            this.lyricObj.lyric = this.list[index].lyric;
            if (this.lyricObj && this.lyricObj.addLyric) {
                this.lyricObj.addLyric();
            }
        }
    };
    PlayListUI.prototype._addEventListeners = function () {
        var _this = this;
        setTimeout(function () {
            _this.on('shuffledchanged', function () {
                var _a, _b;
                if (_this.shuffled) {
                    _this.container.classList.add(_this.stateClass.shuffled);
                    (_a = document.querySelector(_this.player.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.classList.add(_this.stateClass.shuffled);
                }
                else {
                    _this.container.classList.remove(_this.stateClass.shuffled);
                    (_b = document.querySelector(_this.player.cssSelectorAncestor)) === null || _b === void 0 ? void 0 : _b.classList.remove(_this.stateClass.shuffled);
                }
            });
            _this.on('modechange', function () {
                _this.updateRepeatButtonState();
            });
            _this.highlightItem();
            _this.on('remove', function (index) {
                var _a;
                (_a = _this.container.querySelectorAll(_this.cssSelector.item || '')[index]) === null || _a === void 0 ? void 0 : _a.remove();
                _this.highlightItem();
                if (_this.onRemove) {
                    _this.onRemove();
                }
            });
            _this.addEventListener(_this.container, 'click', function (e) {
                var _a, _b;
                var target = e.target;
                if (_this.isMatchedWithSelector(target, _this.cssSelector.remove)) {
                    var itemElement = _this.findItemElement(target);
                    var index = _this.findDomIndex(itemElement);
                    _this.remove(index); // TODO
                }
                else if (_this.isMatchedWithSelector(target, _this.cssSelector.item)) {
                    var itemElement = _this.findItemElement(target);
                    var index = _this.findDomIndex(itemElement);
                    _this.play(index); // TODO
                }
                else if (_this.cssSelector.next && matches(target, (_a = _this.cssSelector) === null || _a === void 0 ? void 0 : _a.next)) {
                    _this.next();
                }
                else if (_this.cssSelector.previous && matches(target, (_b = _this.cssSelector) === null || _b === void 0 ? void 0 : _b.previous)) {
                    _this.previous();
                }
                else if (_this.cssSelector.shuffle && matches(target, _this.cssSelector.shuffle)) {
                    _this.shuffle();
                }
            });
            _this.updateRepeatButtonState();
        }, 0);
    };
    PlayListUI.prototype.updateRepeatButtonState = function () {
        var _a, _b, _c, _d, _e, _f;
        if (this.modeIndex === 0) {
            (_a = document.querySelector(this.player.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.classList.remove(this.player.stateClass.looped);
            (_b = document.querySelector(this.player.cssSelectorAncestor)) === null || _b === void 0 ? void 0 : _b.querySelector(this.player.cssSelector.repeat).classList.remove(this.player.stateClass.repeatOne);
        }
        else if (this.modeIndex === 1) {
            (_c = document.querySelector(this.player.cssSelectorAncestor)) === null || _c === void 0 ? void 0 : _c.classList.add(this.player.stateClass.looped);
            (_d = document.querySelector(this.player.cssSelectorAncestor)) === null || _d === void 0 ? void 0 : _d.querySelector(this.player.cssSelector.repeat).classList.add(this.player.stateClass.repeatOne);
        }
        else if (this.modeIndex === 2) {
            (_e = document.querySelector(this.player.cssSelectorAncestor)) === null || _e === void 0 ? void 0 : _e.classList.add(this.player.stateClass.looped);
            (_f = document.querySelector(this.player.cssSelectorAncestor)) === null || _f === void 0 ? void 0 : _f.querySelector(this.player.cssSelector.repeat).classList.remove(this.player.stateClass.repeatOne);
        }
    };
    PlayListUI.prototype.isMatchedWithSelector = function (dom, cssSelector, rootElement) {
        if (rootElement === void 0) { rootElement = this.container; }
        if (!cssSelector)
            return false;
        do {
            if (matches(dom, cssSelector)) {
                return true;
            }
            dom = dom.parentNode;
        } while (dom && dom !== rootElement && dom !== document);
        return false;
    };
    PlayListUI.prototype.findDomIndex = function (element) {
        var allItemElements = this.container.querySelectorAll(this.cssSelector.item || '');
        for (var i = 0; i < allItemElements.length; i++) {
            if (allItemElements[i] === element) {
                return i;
            }
        }
        return 0;
    };
    PlayListUI.prototype.findItemElement = function (dom) {
        do {
            if (this.cssSelector.item && matches(dom, this.cssSelector.item)) {
                return dom;
            }
            dom = dom.parentNode;
        } while (dom !== this.container && dom !== document);
        return null;
    };
    PlayListUI.prototype.highlightItem = function (index) {
        var _a, _b;
        if (index === void 0) { index = this.index; }
        (_a = this.container.querySelector(this.cssSelector.item + '.' + this.stateClass.currentItem)) === null || _a === void 0 ? void 0 : _a.classList.remove(this.stateClass.currentItem || '');
        var itemElements = this.container.querySelectorAll(this.cssSelector.item || '');
        if (itemElements.length) {
            (_b = itemElements[index]) === null || _b === void 0 ? void 0 : _b.classList.add(this.stateClass.currentItem || '');
        }
    };
    return PlayListUI;
}(PlayList));

var YuanPlayer = /** @class */ (function () {
    function YuanPlayer(options) {
        return new (YuanPlayer.use())(options);
    }
    YuanPlayer.use = function (themeObject) {
        if (themeObject === void 0) { themeObject = {}; }
        var obj = {
            Player: themeObject.Player ? themeObject.Player(PlayerUI) : PlayerUI,
            Lyric: themeObject.Lyric ? themeObject.Lyric(LyricUI) : LyricUI,
            PlayList: themeObject.PlayList ? themeObject.PlayList(PlayListUI) : PlayListUI
        };
        var MyClass = /** @class */ (function () {
            function MyClass(options) {
                var _this = this;
                var _a;
                this.playerClass = obj.Player;
                this.lyricClass = obj.Lyric;
                this.playlistClass = obj.PlayList;
                this.options = options;
                this.playerInstance = this.playerClass ? new this.playerClass(__assign(__assign({}, options), { media: isArray(options.media) && options.media.length ? options.media[0] : options.media, container: options.container })) : null;
                this.lyricInstance = this.lyricClass ? new this.lyricClass(__assign(__assign({}, options), { player: this.playerInstance, lyric: isArray(options.media) && options.media.length ? options.media[0].lyric : (((_a = options.media) === null || _a === void 0 ? void 0 : _a.lyric) || ''), mediaElement: this.playerInstance.mediaElement, container: options.container })) : null;
                this.setPlaylistInstance();
                ['play', 'playHead', 'isPlaying', 'stop', 'toggleLoop', 'pause', 'mute', 'unmute', 'volume', 'clearMedia'].forEach(function (f) {
                    _this[f] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (!_this.playerInstance) {
                            console.warn("The player instance has not been initialized");
                            return;
                        }
                        return _this.playerInstance[f].apply(_this.playerInstance, args);
                    };
                });
                ['loadLyricPlugin', 'unload', 'setLyric'].forEach(function (f) {
                    _this[f] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (!_this.lyricInstance) {
                            console.warn("The lyric instance has not been initialized");
                            return;
                        }
                        return _this.lyricInstance[f].apply(_this.lyricInstance, args);
                    };
                });
                ['shuffle', 'add', 'select', 'remove', 'switchModes', 'setMode', 'next', 'previous', 'playAtIndex'].forEach(function (f) {
                    _this[f] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (!_this.playlistInstance) {
                            console.warn("The playlist instance has not been initialized");
                            return;
                        }
                        return _this.playlistInstance[f].apply(_this.playlistInstance, args);
                    };
                });
                YuanPlayer.instances.push(this);
            }
            MyClass.prototype.setPlaylistInstance = function (options) {
                if (options === void 0) { options = this.options; }
                this.playlistInstance = this.playlistClass && isArray(options.media) ? new this.playlistClass(__assign(__assign({}, options), { container: options.container, list: isArray(options.media) && options.media.length ? __spreadArray([], options.media, true) : [], player: this.playerInstance, lyricObj: this.lyricInstance })) : null;
            };
            MyClass.prototype.setMedia = function (media) {
                if (this.playerInstance) {
                    this.playerInstance.setMedia(media);
                }
                if (this.lyricInstance) {
                    this.lyricInstance.setLyric(media.lyric);
                }
                // destroy the playlist instance
                if (this.playlistInstance) {
                    this.playlistInstance.destroy();
                    this.playlistInstance = null;
                }
            };
            MyClass.prototype.setPlaylist = function (playlist) {
                var _a;
                if (!isArray(playlist))
                    return;
                if (!this.playlistInstance) {
                    this.setPlaylistInstance(__assign(__assign({}, this.options), { media: playlist }));
                }
                (_a = this.playlistInstance) === null || _a === void 0 ? void 0 : _a.setPlaylist(playlist);
            };
            MyClass.prototype.on = function (event, callback) {
                if (MyClass.playerEvents.indexOf(event) > -1) {
                    this.playerInstance.on(event, callback);
                }
                else if (MyClass.lyricEvents.indexOf(event) > -1) {
                    this.lyricInstance.on(event, callback);
                }
                else if (MyClass.playlistEvents.indexOf(event) > -1) {
                    this.playlistInstance.on(event, callback);
                }
            };
            MyClass.prototype.off = function (event, callback) {
                if (MyClass.playerEvents.indexOf(event) > -1) {
                    this.playerInstance.off(event, callback);
                }
                else if (MyClass.lyricEvents.indexOf(event) > -1) {
                    this.lyricInstance.off(event, callback);
                }
                else if (MyClass.playlistEvents.indexOf(event) > -1) {
                    this.playlistInstance.off(event, callback);
                }
            };
            MyClass.prototype.pauseOthers = function () {
                var _this = this;
                YuanPlayer.instances.forEach(function (instance) {
                    if (instance !== _this) {
                        instance.pause();
                    }
                });
            };
            MyClass.prototype.destroy = function () {
                if (this.playerInstance) {
                    this.playerInstance.destroy();
                }
                if (this.lyricInstance) {
                    this.lyricInstance.destroy();
                }
                if (this.playlistInstance) {
                    this.playlistInstance.destroy();
                }
            };
            // Events Group
            MyClass.playerEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting', 'error', 'stalled', 'setmedia', 'stop', 'loopchanged', 'clearmedia', 'destroy']; // TODO 'destroy'
            MyClass.lyricEvents = ['lyricfetched', 'timeupdated', 'reset'];
            MyClass.playlistEvents = ['shuffledchanged', 'add', 'select', 'remove', 'modechange'];
            return MyClass;
        }());
        return MyClass;
    };
    YuanPlayer.instances = [];
    return YuanPlayer;
}());

module.exports = YuanPlayer;
