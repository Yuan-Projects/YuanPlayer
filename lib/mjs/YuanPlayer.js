// @ts-nocheck
/**
 * Deferred Object
 */
function Deferred() {
    var slice = Array.prototype.slice;
    var status = "pending";
    var callbacks = { ok: [], fail: [] };
    var values;
    function resolveInternal(state, args) {
        if (status !== "pending") {
            throw new Error("Deferred has already been resolved");
        }
        status = state;
        values = slice.call(args, 0);
        callbacks[state].forEach(function (e) {
            e.apply(e, values);
        });
    }
    return {
        resolve: function () {
            resolveInternal("ok", arguments);
        },
        reject: function () {
            resolveInternal("fail", arguments);
        },
        promise: function () {
            var self;
            function promiseInternal(state, func) {
                if (typeof func !== "function") {
                    throw new Error("Callback argument must be a Function");
                }
                if (status === state) {
                    func.apply(func, values);
                }
                else {
                    callbacks[state].push(func);
                }
                return self;
            }
            self = {
                done: function (func) {
                    return promiseInternal("ok", func);
                },
                fail: function (func) {
                    return promiseInternal("fail", func);
                },
                then: function (done, error) {
                    return this.done(done).fail(error);
                },
            };
            return self;
        },
    };
}

/**
 * Helper functions
 *
 */
function encodeFormatData(data) {
    if (!data)
        return ""; // Always return a string
    if (typeof data === "string")
        return data;
    var pairs = []; // To hold name=value pairs
    for (var name in data) {
        // For each name
        if (!data.hasOwnProperty(name))
            continue; // Skip inherited
        if (typeof data[name] === "function")
            continue; // Skip methods
        if (Object.prototype.toString.call(data[name]) ===
            "[object Array]") {
            for (var i = 0, len = data[name].length; i < len; i++) {
                pairs.push(encodeURIComponent(name) +
                    "[]=" +
                    encodeURIComponent(data[name][i].toString()));
            }
            continue;
        }
        var value = data[name].toString(); // Value as string
        name = encodeURIComponent(name); // Encode name
        value = encodeURIComponent(value); // Encode value
        pairs.push(name + "=" + value); // Remember name=value pair
    }
    return pairs.join("&"); // Return joined pairs separated with &
}
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"), dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor",
        ], dontEnumsLength = dontEnums.length;
        return function (obj) {
            if (typeof obj !== "object" &&
                (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.keys called on non-object");
            }
            var result = [], prop, i;
            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }
            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    })();
}

/**
 * Ajax request
 *
 */
function ajax(options) {
    var dtd = Deferred();
    var xhr = getXHR();
    var url = options.url;
    var type = options.type ? options.type.toUpperCase() : "GET";
    var isAsyc = !!options.asyc || true;
    var successCallBack = options.success;
    var errorCallBack = options.error;
    var completeCallBack = options.complete;
    var data = options.data ? encodeFormatData(options.data) : "";
    var dataType = options.dataType || "text";
    var contentType = options.contentType || "application/x-www-form-urlencoded";
    var timeout = options.timeout && !isNaN(options.timeout) && options.timeout > 0
        ? options.timeout
        : 0;
    var timedout = false;
    var headers = Object.prototype.toString.call(options.headers) === "[object Object]"
        ? options.headers
        : null;
    if (timeout) {
        var timer = setTimeout(function () {
            timedout = true;
            xhr.abort();
            xhr.message = "Canceled";
            dtd.reject(xhr);
        }, timeout);
    }
    if (type === "GET" && data !== "") {
        url += (url.indexOf("?") === -1 ? "?" : "&") + data;
    }
    xhr.open(type, url, isAsyc);
    if (isAsyc) {
        if ("onreadystatechange" in xhr) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callBack();
                }
            };
        }
        else {
            xhr.onload = callBack;
            xhr.onerror = function () {
                if (errorCallBack) {
                    errorCallBack("error", xhr);
                }
                dtd.reject(xhr);
            };
        }
    }
    if (xhr.setRequestHeader) {
        xhr.setRequestHeader("Content-Type", contentType);
    }
    if (headers && xhr.setRequestHeader) {
        // No custom headers may be added to the request in the XDomainRequest object
        for (var prop in headers) {
            if (headers.hasOwnProperty(prop)) {
                // @ts-ignore
                xhr.setRequestHeader(prop, headers[prop]);
            }
        }
    }
    switch (type) {
        case "POST":
            xhr.send(data);
            break;
        case "GET":
            xhr.send(null);
    }
    if (!isAsyc) {
        callBack();
    }
    function getXHR() {
        var xhr = new XMLHttpRequest();
        return xhr;
    }
    function callBack() {
        if (timedout) {
            return;
        }
        clearTimeout(timer);
        var resultText = xhr.responseText;
        var resultXML = xhr.responseXML;
        var textStatus = xhr.statusText;
        if (completeCallBack) {
            completeCallBack(xhr, textStatus);
        }
        // Determine if successful
        if ("status" in xhr) {
            var status = xhr.status;
            var isSuccess = (status >= 200 && status < 300) || status === 304;
            if (isSuccess) {
                var resultType = xhr.getResponseHeader("Content-Type");
                if (dataType === "xml" ||
                    (resultType && resultType.indexOf("xml") !== -1 && xhr.responseXML)) {
                    if (successCallBack) {
                        successCallBack(resultXML, xhr);
                    }
                }
                else if (dataType === "json" || resultType === "application/json") {
                    if (successCallBack) {
                        successCallBack(JSON.parse(resultText), xhr);
                    }
                }
                else {
                    if (successCallBack) {
                        successCallBack(resultText, xhr);
                    }
                }
                dtd.resolve(xhr);
            }
            else {
                if (errorCallBack) {
                    errorCallBack(status, xhr);
                }
                dtd.reject(xhr);
            }
        }
        else {
            // XDomainRequest
            if (dataType === "xml" || xhr.responseXML) {
                if (successCallBack) {
                    successCallBack(resultXML, xhr);
                }
            }
            else if (dataType === "json") {
                if (successCallBack) {
                    successCallBack(JSON.parse(resultText), xhr);
                }
            }
            else {
                if (successCallBack) {
                    successCallBack(resultText, xhr);
                }
            }
            dtd.resolve(xhr);
        }
    }
    return dtd.promise();
}

"data" + new Date().getTime();

// @ts-nocheck
if (!Array.isArray) {
    Array.isArray = function (vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    };
}
function YuanPlayer(options) {
    if (!YuanPlayer.helper.isHtml5AudioSupported()) {
        throw new Error("Your browser does not support HTML5 Audio.");
    }
    this.container = 'yuanplayer';
    this.mediaObject = null;
    this.errorCode = 0;
    this.errorMessage = '';
    this.eventHandlers = {};
    this.init(options);
}
YuanPlayer.helper = {
    isHtml5AudioSupported: function () {
        return document.createElement("audio").play;
    },
    innerText: function (element, text) {
        (typeof element.textContent !== 'undefined') ? (element.textContent = text) : (element.innerText = text);
    }
};
YuanPlayer.error = {
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
YuanPlayer.prototype = {
    constructor: YuanPlayer,
    init: function (options) {
        this.initOptions(options);
        // If no valid container exists, we do nothing.
        if (!this.container || !document.getElementById(this.container))
            return;
        this.addMediaElement();
        this.bindMediaEvents();
    },
    initOptions: function (options) {
        for (var prop in options) {
            this[prop] = options[prop];
        }
    },
    addMediaElement: function () {
        var container = document.getElementById(this.container);
        if (container) {
            var mediaElement = document.createElement('audio');
            this.mediaObject = mediaElement;
            mediaElement.controls = 'controls';
            if (typeof this.loop !== "undefined") {
                mediaElement.loop = !!this.loop;
            }
            this.addMediaSource();
            container.appendChild(mediaElement);
        }
    },
    bindMediaEvents: function () {
        var that = this;
        var media = this.mediaObject;
        if (!media)
            return;
        var t = window.setInterval(function () {
            if (media.networkState === 3) {
                that.errorCode = YuanPlayer.error.MEDIA_ERR_URLEMPTY.code;
                that.errorMessage = YuanPlayer.error.MEDIA_ERR_URLEMPTY.message;
                clearInterval(t);
                that.trigger('error');
            }
        }, 100);
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
            updateDuration();
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
                    that.errorCode = YuanPlayer.error.MEDIA_ERR_ABORTED.code;
                    that.errorMessage = YuanPlayer.error.MEDIA_ERR_ABORTED.message;
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    that.errorCode = YuanPlayer.error.MEDIA_ERR_NETWORK.code;
                    that.errorMessage = YuanPlayer.error.MEDIA_ERR_NETWORK.message;
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    that.errorCode = YuanPlayer.error.MEDIA_ERR_DECODE.code;
                    that.errorMessage = YuanPlayer.error.MEDIA_ERR_DECODE.message;
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    that.errorCode = YuanPlayer.error.MEDIA_ERR_SRC_NOT_SUPPORTED.code;
                    that.errorMessage = YuanPlayer.error.MEDIA_ERR_SRC_NOT_SUPPORTED.message;
                    break;
                default:
                    that.errorCode = YuanPlayer.error.MEDIA_ERR_UNKNOWN.code;
                    that.errorMessage = YuanPlayer.error.MEDIA_ERR_UNKNOWN.message;
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
            updateDuration();
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
            that.errorCode = YuanPlayer.error.MEDIA_ERR_URLEMPTY.code;
            that.errorMessage = YuanPlayer.error.MEDIA_ERR_URLEMPTY.message;
            that.trigger('error');
            clearInterval(t);
        }, false);
        media.addEventListener('suspend', function () {
            that.trigger('suspend');
        }, false);
        media.addEventListener('timeupdate', function () {
            updateCurrentTime();
            that.trigger('timeupdate');
        }, false);
        media.addEventListener('volumechange', function () {
            that.trigger('volumechange');
        }, false);
        media.addEventListener('waiting', function () {
            that.trigger('waiting');
        }, false);
    },
    compareTimeSpan: function (x, y) {
        var timePattern = /\[([0-9]{2}:[0-9]{2}\.[0-9]{2,3})\]/;
        var xTime = x.match(timePattern)[1], yTime = y.match(timePattern)[1];
        var xTimeInSeconds = this.parseTimeToSeconds(xTime), yTimeInSeconds = this.parseTimeToSeconds(yTime);
        //debugger;
        return xTimeInSeconds - yTimeInSeconds;
    },
    parseTimeToSeconds: function (timeString) {
        var component = timeString.split('.');
        var bigPart = component[0];
        var bigPartComponent = bigPart.split(':');
        var minutePart = parseInt(bigPartComponent[0]);
        var secondPart = parseInt(bigPartComponent[1]);
        return minutePart * 60 + secondPart + '.' + component[1];
    },
    formatTime: function (timeInSeconds) {
        var result = "";
        var seconds = Math.floor(timeInSeconds), hours = Math.floor(seconds / 3600), minutes = Math.floor((seconds - (hours * 3600)) / 60), seconds = seconds - (hours * 3600) - (minutes * 60);
        if (hours > 0 && minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        result = hours ? (hours + ':') : '' + minutes + ':' + seconds;
        return result;
    },
    addMediaSource: function () {
        this.mediaObject;
        var sources = this.source;
        if (sources) {
            this.setMedia(sources);
        }
    },
    play: function () {
        if (this.mediaObject) {
            this.mediaObject.play();
        }
    },
    togglePlay: function () {
        var media = this.mediaObject;
        if (media) {
            if (media.paused) {
                media.play();
            }
            else {
                media.pause();
            }
        }
    },
    stop: function () {
        var media = this.mediaObject;
        if (media) {
            media.pause();
            media.currentTime = 0;
        }
    },
    toggleLoop: function () {
        var media = this.mediaObject;
        if (media) {
            media.loop = !media.loop;
        }
        this.trigger('loopchanged');
    },
    getMimeType: function (fileName) {
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
    },
    pause: function () {
        var media = this.mediaObject;
        if (media) {
            media.pause();
        }
    },
    setMedia: function (mediaParam) {
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
            if (Array.isArray(mediaParam)) {
                for (var i = 0; i < mediaParam.length; i++) {
                    this.setMediaItem(mediaParam[i]);
                }
            }
            else {
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
    mute: function () {
        var media = this.mediaObject;
        if (media) {
            media.muted = true;
        }
    },
    unmute: function () {
        var media = this.mediaObject;
        if (media) {
            media.muted = false;
        }
    },
    toggleMute: function () {
        var media = this.mediaObject;
        if (media) {
            media.muted = !media.muted;
        }
    },
    addVolume: function () {
        var media = this.mediaObject;
        if (media) {
            var temp = media.volume + 0.2;
            media.volume = (temp >= 1.0) ? 1.0 : temp;
        }
    },
    minusVolume: function () {
        var media = this.mediaObject;
        if (media) {
            var temp = media.volume - 0.2;
            media.volume = (temp >= 0.0) ? temp : 0.0;
        }
    },
    on: function (event, callback) {
        var Events = this.eventHandlers;
        if (!Events[event]) {
            Events[event] = [];
        }
        Events[event].push(callback);
    },
    off: function (event, callback) {
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
    },
    trigger: function (event) {
        var Events = this.eventHandlers;
        if (!Events[event])
            return;
        var args = Array.prototype.slice.call(arguments, 1);
        var callbackArray = Events[event];
        for (var i = callbackArray.length - 1; i >= 0; i--) {
            callbackArray[i].apply(callbackArray[i], args);
        }
    }
};
YuanPlayer.prototype.lyricObj = {
    timeArray: [],
    lyricArray: []
};
YuanPlayer.prototype.lyricCurrentPosition = 0;
YuanPlayer.prototype.addLyricItems = function (items) {
    document.getElementById('lyric-container');
    var wrapContainer = document.getElementById('lyric-wrapcontainer');
    for (var i = 0, l = items.length; i < l; i++) {
        var div = document.createElement('div');
        var content = items[i].split(']')[1];
        YuanPlayer.helper.innerText(div, content);
        wrapContainer.appendChild(div);
    }
};
YuanPlayer.prototype.parseLyricItems = function (items) {
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
YuanPlayer.prototype.logLyricInfo = function (items) {
    var patt = /\[|\]/;
    for (var i = 0; i < items.length; i++) {
        var component = items[i].split(patt);
        if (component[2] === '') ;
        this.lyricObj.timeArray.push(this.parseTimeToSeconds(component[1]));
        this.lyricObj.lyricArray.push(component[2]);
    }
};
YuanPlayer.prototype.addLyric = function () {
    var that = this;
    var lyric = this.lyric;
    if (lyric) {
        if (typeof lyric === 'string') {
            if (!document.getElementById('lyric-container')) {
                // Add container for lyric
                var lyricDiv = document.createElement('div');
                var wrapContainer = document.createElement('div');
                lyricDiv.id = "lyric-container";
                wrapContainer.id = "lyric-wrapcontainer";
                document.body.appendChild(lyricDiv);
                lyricDiv.appendChild(wrapContainer);
            }
            else {
                document.getElementById('lyric-container').innerHTML = '<div id="lyric-wrapcontainer"></div>';
            }
            if (lyric.substr(0, 8) === 'https://' || lyric.substr(0, 7) === 'http://') {
                ajax({ url: lyric, contentType: "text/plain" }).then(function (lyricText) {
                    var lyricItems = lyricText.responseText.split(/[\n\r]/g);
                    lyricItems = that.parseLyricItems(lyricItems);
                    lyricItems.sort(function (x, y) { return that.compareTimeSpan.call(that, x, y); });
                    that.addLyricItems(lyricItems);
                    that.logLyricInfo(lyricItems);
                }, function (err) {
                    console.log('error:', err);
                });
            }
        }
    }
};
YuanPlayer.prototype.bindLyricEvents = function () {
    var that = this;
    var media = this.mediaObject;
    if (!media)
        return;
    media.addEventListener('timeupdate', function () {
        if (that.lyric && that.lyricObj.timeArray.length && that.lyricObj.lyricArray.length) {
            that.scrollLyric(media.currentTime);
        }
    }, false);
};
YuanPlayer.prototype.scrollLyric = function (currentTime) {
    var newLyricIndex = this.getNewLyricIndex(currentTime);
    var oldPosition = this.lyricCurrentPosition;
    if (newLyricIndex === oldPosition)
        return;
    this.lyricCurrentPosition = newLyricIndex;
    // Hightlight the current lyric
    var lyricDivs = document.getElementById('lyric-wrapcontainer').getElementsByTagName('div');
    lyricDivs[oldPosition].className = '';
    lyricDivs[newLyricIndex].className = 'highlight';
    // Scroll the lyrics container
    var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
    document.getElementById('lyric-container').scrollTop = newScrollTop;
};
YuanPlayer.prototype.getNewLyricIndex = function (currentTime) {
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
YuanPlayer.prototype.loadLyricPlugin = function () {
    this.addLyric();
    this.bindLyricEvents();
};

export { YuanPlayer as default };
