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

var isHtml5AudioSupported = function () {
    return document.createElement("audio").play;
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
    // @ts-ignore
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
function matches(element, selectors) {
    if (element.matches) {
        return element.matches(selectors);
    }
    else if (element.msMatchesSelector) {
        return element.msMatchesSelector(selectors);
    }
    else if (element.webkitMatchesSelector) {
        return element.webkitMatchesSelector(selectors);
    }
    return false;
}

var Emitter = /** @class */ (function () {
    function Emitter() {
        this.eventHandlers = {};
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
        for (var i = callbackArray.length - 1; i >= 0; i--) {
            callbackArray[i].apply(callbackArray[i], args);
        }
    };
    return Emitter;
}());

/**
 * Render the <audio> tag into a specific DOM element
 * And add listeners for media playback events
 * This file does not contains the player UI
 */
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(options) {
        var _this = _super.call(this) || this;
        _this.loop = false;
        _this.nativeControls = false;
        _this.isAudioSupported = false;
        if (isHtml5AudioSupported()) {
            //throw new Error("Your browser does not support HTML5 Audio.");
            _this.isAudioSupported = true;
        }
        _this.errorCode = 0;
        _this.errorMessage = '';
        _this.eventHandlers = {};
        _this.init(options);
        return _this;
    }
    Player.prototype.init = function (options) {
        this.initOptions(options);
        // If no valid container exists, we do nothing.
        if (!this.container)
            return;
        this.addMediaElement();
        this.bindMediaEvents();
    };
    Player.prototype.initOptions = function (options) {
        for (var prop in options) {
            // @ts-ignore
            this[prop] = prop === 'loop' ? options[prop] === 'one' : options[prop];
        }
    };
    Player.prototype.addMediaElement = function () {
        var div = document.createElement('div');
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
    };
    Player.prototype.bindMediaEvents = function () {
        var _this = this;
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
        var mediaEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
        mediaEvents.forEach(function (event) {
            media.addEventListener(event, function () { return _this.trigger(event); }, false);
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
    };
    Player.prototype.addMediaSource = function () {
        var _this = this;
        if (!this.media || !this.media.src)
            return false;
        this.mediaObject.innerHTML = '';
        this.mediaObject.removeAttribute('src');
        var src = this.media.src;
        if (typeof src === 'string') {
            src = [src];
        }
        for (var i = 0; i < src.length; i++) {
            this.addSourceElement(src[i]);
        }
        setTimeout(function () {
            _this.trigger('setmedia');
        }, 30);
    };
    /**
     * Defines the media to play.
     * @param media
     */
    Player.prototype.setMedia = function (media) {
        this.media = media;
        this.addMediaSource();
        this.mediaObject.load();
    };
    Player.prototype.formatTime = function (secs) {
        var minutes = Math.floor(secs / 60);
        var seconds = Math.floor(secs % 60);
        var returnedSeconds = seconds < 10 ? "0".concat(seconds) : "".concat(seconds);
        return "".concat(minutes, ":").concat(returnedSeconds);
    };
    /**
     * Plays the media file.
     */
    Player.prototype.play = function () {
        if (this.mediaObject && this.mediaObject.currentSrc) {
            var playPromise = this.mediaObject.play();
            if (playPromise !== undefined) {
                playPromise.then(function () { })["catch"](function (error) { });
            }
        }
    };
    /**
     * moves the play-head to a new position
     * @param percent
     */
    Player.prototype.playHead = function (percent) {
        this.mediaObject.currentTime = percent * this.mediaObject.duration;
    };
    Player.prototype.isPlaying = function () {
        return this.mediaObject && !this.mediaObject.paused;
    };
    Player.prototype.togglePlay = function () {
        var media = this.mediaObject;
        if (!media)
            return false;
        if (media.paused) {
            var playPromise = media.play();
            // The play() method returns a Promise which is resolved when playback has been successfully started.
            // Note: Browsers released before 2019 may not return a value from play().
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
            if (playPromise !== undefined) {
                playPromise.then(function () { })["catch"](function (error) { });
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
        var media = this.mediaObject;
        if (media) {
            media.pause();
            media.currentTime = 0;
            this.trigger('stop');
        }
    };
    Player.prototype.toggleLoop = function () {
        var media = this.mediaObject;
        if (media) {
            media.loop = !media.loop;
        }
        this.trigger('loopchanged');
    };
    Player.prototype.getMimeType = function (fileName) {
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
    };
    /**
     * Pause the media.
     */
    Player.prototype.pause = function () {
        var media = this.mediaObject;
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
    Player.prototype.addSourceElement = function (src) {
        var sourceElement = document.createElement('source');
        sourceElement.src = src;
        sourceElement.type = this.getMimeType(src);
        this.mediaObject.appendChild(sourceElement);
    };
    /**
     * Mutes the media's sounds
     */
    Player.prototype.mute = function () {
        var media = this.mediaObject;
        if (media) {
            media.muted = true;
        }
    };
    /**
     * Unmutes the media's sounds.
     */
    Player.prototype.unmute = function () {
        var media = this.mediaObject;
        if (media) {
            media.muted = false;
        }
    };
    Player.prototype.toggleMute = function () {
        var media = this.mediaObject;
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
        this.mediaObject.volume = (ratio >= 1.0) ? 1.0 : ratio;
    };
    /**
     * This method is used to clear the media and stop playback.
     * If a media file is downloading at the time, the download will be cancelled.
     */
    Player.prototype.clearMedia = function () {
        if (!this.mediaObject)
            return false;
        this.stop();
        this.mediaObject.innerHTML = '';
        this.mediaObject.src = '';
        this.trigger('clearmedia');
    };
    // TODO
    /**
     * Removes YuanPlayer.
     * All event and interface bindings created are removed.
     */
    Player.prototype.destroy = function () {
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
            noSolution: ".yuan-no-solution"
        };
        _this.stateClass = {
            repeatOne: "yuan-repeat-one",
            playing: "yuan-state-playing",
            seeking: "yuan-state-seeking",
            muted: "yuan-state-muted",
            looped: "yuan-state-looped",
            fullScreen: "yuan-state-full-screen",
            noVolume: "yuan-state-no-volume"
        };
        _this.cssSelectorAncestor = options.cssSelectorAncestor || "#yuan_container_".concat(uuidv4());
        _this.useStateClassSkin = !!options.useStateClassSkin;
        _this.cssSelector = __assign(__assign({}, _this.cssSelector), options.cssSelector);
        _this.stateClass = __assign(__assign({}, _this.stateClass), options.stateClass);
        if (!_this.nativeControls && _this.isAudioSupported) {
            _this.addEventListeners();
        }
        if (!_this.isAudioSupported) {
            setTimeout(function () {
                var element = document.querySelector("".concat(_this.cssSelectorAncestor, " ").concat(_this.cssSelector.noSolution));
                if (element) {
                    element.style.display = 'block';
                }
            }, 0);
        }
        return _this;
    }
    PlayerUI.prototype.addEventListeners = function () {
        var _this = this;
        setTimeout(function () {
            var domElement = document.querySelector(_this.cssSelectorAncestor);
            if (!domElement)
                return false;
            var clickHandler = function (e) {
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
                else if (_this.isMatchedWithSelector(target, _this.cssSelector.stop)) {
                    _this.stop();
                }
                else if (_this.isMatchedWithSelector(target, _this.cssSelector.repeat)) {
                    // TODO
                    domElement.classList.toggle(_this.stateClass.looped);
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
            domElement.addEventListener('click', clickHandler, false);
            _this.on('ended', function () {
                domElement.classList.remove(_this.stateClass.playing);
            });
            _this.on('durationchange', function () {
                if (!_this.cssSelector.duration)
                    return false;
                var element = domElement.querySelector(_this.cssSelector.duration);
                if (element) {
                    element.textContent = _this.formatTime(Math.floor(_this.mediaObject.duration));
                }
            });
            _this.on('setmedia', function () {
                if (!_this.cssSelector.title)
                    return false;
                var element = domElement.querySelector(_this.cssSelector.title);
                if (element) {
                    element.textContent = _this.media.title || '';
                }
            });
            _this.on('timeupdate', function () {
                var second = Math.floor(_this.mediaObject.currentTime);
                if (_this.cssSelector.currentTime) {
                    domElement.querySelector(_this.cssSelector.currentTime).textContent = _this.formatTime(second);
                }
                if (_this.cssSelector.playBar) {
                    var element = domElement.querySelector(_this.cssSelector.playBar);
                    if (element) {
                        var perc = isFinite(_this.mediaObject.duration) ? _this.mediaObject.currentTime / _this.mediaObject.duration : 0;
                        element.style.width = "".concat(perc * 100, "%");
                    }
                }
            });
            _this.on('play', function () {
                var _a;
                // If current src is empty, we should not add the state class
                if ((_a = _this.mediaObject) === null || _a === void 0 ? void 0 : _a.currentSrc) {
                    domElement.classList.add(_this.stateClass.playing);
                }
            });
            _this.on('pause', function () {
                domElement.classList.remove(_this.stateClass.playing);
            });
            _this.on('stop', function () {
                domElement.classList.remove(_this.stateClass.playing);
                if (_this.cssSelector.currentTime) {
                    domElement.querySelector(_this.cssSelector.currentTime).textContent = _this.formatTime(0);
                }
                if (_this.cssSelector.playBar) {
                    domElement.querySelector(_this.cssSelector.playBar).style.width = "0%";
                }
            });
            _this.on('clearmedia', function () {
                domElement === null || domElement === void 0 ? void 0 : domElement.classList.remove(_this.stateClass.playing);
                if (_this.cssSelector.currentTime) {
                    domElement.querySelector(_this.cssSelector.currentTime).textContent = _this.formatTime(0);
                }
                if (_this.cssSelector.duration) {
                    domElement.querySelector(_this.cssSelector.duration).textContent = _this.formatTime(0);
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
            _this.on('volumechange', function () {
                _this.updateVolume();
            });
            _this.on('loopchanged', function () {
                _this.updateLoopState();
            });
            _this.updateVolume();
            _this.updateLoopState();
        }, 0);
    };
    PlayerUI.prototype.updateLoopState = function () {
        var _a, _b;
        var domElement = document.querySelector(this.cssSelectorAncestor);
        if (!domElement)
            return false;
        if (this.mediaObject.loop) {
            domElement.classList.add(this.stateClass.looped);
            if (this.cssSelector.repeat) {
                var repeatBtn = domElement.querySelector(this.cssSelector.repeat);
                if (repeatBtn) {
                    repeatBtn.classList.add(((_a = this.stateClass) === null || _a === void 0 ? void 0 : _a.repeatOne) || '');
                }
            }
        }
        else {
            domElement.classList.remove(this.stateClass.looped);
            if (this.cssSelector.repeat) {
                var repeatBtn = domElement.querySelector(this.cssSelector.repeat);
                if (repeatBtn) {
                    repeatBtn.classList.remove(((_b = this.stateClass) === null || _b === void 0 ? void 0 : _b.repeatOne) || '');
                }
            }
        }
    };
    PlayerUI.prototype.isMatchedWithSelector = function (dom, cssSelector, rootElement) {
        if (rootElement === void 0) { rootElement = this.container; }
        if (!cssSelector)
            return false;
        do {
            if (matches(dom, cssSelector)) {
                return true;
            }
            dom = dom.parentNode;
        } while (dom !== document.querySelector(this.cssSelectorAncestor) && dom !== document);
        return false;
    };
    PlayerUI.prototype.updateVolume = function () {
        var domElement = document.querySelector(this.cssSelectorAncestor);
        if (!domElement)
            return false;
        if (this.mediaObject.muted) {
            domElement.classList.add(this.stateClass.muted);
        }
        else {
            domElement.classList.remove(this.stateClass.muted);
        }
        if (this.cssSelector.volumeValue) {
            var element = domElement.querySelector(this.cssSelector.volumeValue);
            if (element) {
                element.textContent = String(trunc(this.mediaObject.volume * 100));
            }
        }
        if (!this.cssSelector.volumeBarValue)
            return false;
        var ele = domElement.querySelector(this.cssSelector.volumeBarValue);
        var val = trunc(this.mediaObject.volume * 100);
        if (ele) {
            ele.style.width = this.mediaObject.muted ? '0%' : val + "%";
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
        _this.mediaObject = options.mediaObject;
        _this.lyric = options.lyric;
        _this.container = options.container;
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
        _this._addEventListeners();
        setTimeout(function () {
            _this.loadLyricPlugin();
        }, 0);
        return _this;
    }
    LyricUI.prototype._addEventListeners = function () {
        var _this = this;
        setTimeout(function () {
            _this.on('lyricfetched', function (lyricItems) {
                var _a;
                // @ts-ignore
                (_a = _this.container.querySelector(_this.cssSelectorAncestor)) === null || _a === void 0 ? void 0 : _a.scrollTop = 0;
                // empty previous lyric items
                _this._removeAllItems();
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
        _this.addEvents();
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
    PlayList.prototype.addEvents = function () {
        var _this = this;
        this.on('select', function (index) {
            _this.updatePlayerLyric(index);
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
        //this.updatePlayerLyric(index);
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
    PlayList.prototype.updatePlayerLyric = function (index) {
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
    PlayList.modes = ['off', 'one', 'all'];
    return PlayList;
}(Emitter));

var PlayListUI = /** @class */ (function (_super) {
    __extends(PlayListUI, _super);
    function PlayListUI(options) {
        var _this = _super.call(this, options) || this;
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
        _this.autoPlay = !!options.autoPlay;
        _this.enableRemoveControls = !!options.enableRemoveControls;
        _this.cssSelector = __assign(__assign({}, _this.cssSelector), options.cssSelector);
        _this.stateClass = __assign(__assign({}, _this.stateClass), options.stateClass);
        _this._addEventListeners();
        return _this;
    }
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
            _this._highlightItem();
            _this.on('remove', function (index) {
                var _a;
                (_a = _this.container.querySelectorAll(_this.cssSelector.item || '')[index]) === null || _a === void 0 ? void 0 : _a.remove();
                _this._highlightItem();
            });
            _this.on('select', function (index) {
                _this._highlightItem(index);
            });
            _this.container.addEventListener('click', function (e) {
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
        } while (dom !== rootElement && dom !== document);
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
            if (matches(dom, this.cssSelector.item)) {
                return dom;
            }
            dom = dom.parentNode;
        } while (dom !== this.container && dom !== document);
        return null;
    };
    PlayListUI.prototype._highlightItem = function (index) {
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
                this.playerInstance = this.playerClass ? new this.playerClass(__assign(__assign({}, options), { media: Array.isArray(options.media) && options.media.length ? options.media[0] : options.media, container: options.container })) : null;
                this.lyricInstance = this.lyricClass ? new this.lyricClass(__assign(__assign({}, options), { lyric: Array.isArray(options.media) && options.media.length ? options.media[0].lyric : (((_a = options.media) === null || _a === void 0 ? void 0 : _a.lyric) || ''), mediaObject: this.playerInstance.mediaObject, container: options.container })) : null;
                this.setPlaylistInstance();
                ['formatTime', 'play', 'playHead', 'isPlaying', 'stop', 'toggleLoop', 'pause', 'mute', 'unmute', 'volume', 'clearMedia', 'destroy'].forEach(function (f) {
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
                this.playlistInstance = this.playlistClass && Array.isArray(options.media) ? new this.playlistClass(__assign(__assign({}, options), { container: options.container, list: Array.isArray(options.media) && options.media.length ? __spreadArray([], options.media, true) : [], player: this.playerInstance, lyricObj: this.lyricInstance })) : null;
            };
            MyClass.prototype.setMedia = function (media) {
                if (this.playerInstance) {
                    this.playerInstance.setMedia(media);
                }
                if (this.lyricInstance) {
                    this.lyricInstance.setLyric(media.lyric);
                }
                if (this.playlistInstance) {
                    this.playlistInstance.remove();
                }
            };
            MyClass.prototype.setPlaylist = function (playlist) {
                if (!Array.isArray(playlist))
                    return;
                if (!this.playlistInstance) {
                    this.setPlaylistInstance(__assign(__assign({}, this.options), { media: playlist }));
                }
                if (this.playlistInstance) {
                    this.playlistInstance.setPlaylist(playlist);
                }
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
            // Events Group
            MyClass.playerEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'suspend', 'timeupdate', 'volumechange', 'waiting', 'error', 'stalled', 'setmedia', 'stop', 'loopchanged', 'clearmedia', 'destroy'];
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
