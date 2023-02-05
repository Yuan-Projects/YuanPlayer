(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.YuanPlayerLyric = factory());
})(this, (function () { 'use strict';

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

    // @ts-ignore
    const innerText = function (element, text) {
        (typeof element.textContent !== 'undefined') ? (element.textContent = text) : (element.innerText = text);
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

    // @ts-ignore
    class LyricBase extends Emitter {
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
                if (component[2] === '') ;
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
            var component = timeString.split('.');
            var bigPart = component[0];
            var bigPartComponent = bigPart.split(':');
            var minutePart = parseInt(bigPartComponent[0]);
            var secondPart = parseInt(bigPartComponent[1]);
            return parseFloat(minutePart * 60 + secondPart + '.' + component[1]);
        }
        addLyric() {
            var that = this;
            var lyric = this.lyric;
            if (lyric) {
                if (typeof lyric === 'string') {
                    if (lyric.substr(0, 8) === 'https://' || lyric.substr(0, 7) === 'http://') {
                        ajax({ url: lyric, contentType: "text/plain" }).then(function (lyricText) {
                            var lyricItems = lyricText.responseText.split(/[\n\r]/g);
                            lyricItems = that.parseLyricItems(lyricItems);
                            lyricItems.sort(function (x, y) { return that.compareTimeSpan.call(that, x, y); });
                            // TODO
                            that.trigger('lyricFetched', lyricItems);
                            that.logLyricInfo(lyricItems);
                        }, function (err) {
                            console.log('error:', err);
                        });
                    }
                }
            }
        }
        bindLyricEvents() {
            var that = this;
            var media = this.mediaObject;
            if (!media)
                return;
            media.addEventListener('timeupdate', function () {
                if (that.lyric && that.lyricObj.timeArray.length && that.lyricObj.lyricArray.length) {
                    that.trigger('timeupdated', media.currentTime);
                }
            }, false);
        }
        loadLyricPlugin() {
            this.addLyric();
            this.bindLyricEvents();
        }
    }

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css = ".yuanplayer-lyric-container {\n  margin-top: 2em;\n  border-radius: 5px;\n  text-align: center;\n  height: 100px;\n  border: 1px solid blue;\n  overflow: hidden;\n  padding-top: 50px;\n  margin-left: auto;\n  margin-right: auto;\n  /* Make all lyric items relative to the container */\n}\n.yuanplayer-lyric-container div {\n  margin-bottom: 5px;\n  min-height: 1em; /* Make the empty lyric container visible. */\n}\n.yuanplayer-lyric-container .lyric-wrapcontainer {\n  position: relative;\n}\n.yuanplayer-lyric-container .highlight {\n  font-weight: bold;\n  color: red;\n}\n\n/* For mobile devices */\n@media (max-width: 768px) {\n  .yuanplayer-lyric-container {\n    width: 90%;\n  }\n}";
    n(css,{});

    class YuanPlayerLyric extends LyricBase {
        constructor(otpions) {
            super(otpions);
            this.lyricObj = {
                timeArray: [],
                lyricArray: []
            };
            this.lyricCurrentPosition = 0;
            this.addContainer();
            this.on('lyricFetched', (lyricItems) => {
                this.addLyricItems(lyricItems);
            });
            this.on('timeupdated', (currentTime) => {
                this.scrollLyric(currentTime);
            });
        }
        addContainer() {
            if (typeof this.lyric === 'string') {
                if (!this.container.querySelector('.yuanplayer-lyric-container')) {
                    // Add container for lyric
                    var lyricDiv = document.createElement('div');
                    var wrapContainer = document.createElement('div');
                    lyricDiv.classList.add('yuanplayer-lyric-container');
                    wrapContainer.classList.add('lyric-wrapcontainer');
                    this.container.appendChild(lyricDiv);
                    lyricDiv.appendChild(wrapContainer);
                }
                else {
                    const lyricContainer = document.querySelector('.yuanplayer-lyric-container');
                    if (lyricContainer) {
                        lyricContainer.innerHTML = '<div id="lyric-wrapcontainer"></div>';
                    }
                }
            }
        }
        addLyricItems(items) {
            var wrapContainer = this.container.querySelector('.lyric-wrapcontainer');
            for (var i = 0, l = items.length; i < l; i++) {
                var div = document.createElement('div');
                var content = items[i].split(']')[1];
                innerText(div, content);
                wrapContainer === null || wrapContainer === void 0 ? void 0 : wrapContainer.appendChild(div);
            }
        }
        scrollLyric(currentTime) {
            var _a;
            var newLyricIndex = this.getNewLyricIndex(currentTime);
            var oldPosition = this.lyricCurrentPosition;
            if (newLyricIndex === oldPosition)
                return;
            this.lyricCurrentPosition = newLyricIndex;
            // Hightlight the current lyric
            var lyricDivs = (_a = this.container.querySelector('.lyric-wrapcontainer')) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('div');
            if (lyricDivs) {
                lyricDivs[oldPosition].className = '';
                lyricDivs[newLyricIndex].className = 'highlight';
                // Scroll the lyrics container
                var newScrollTop = lyricDivs[newLyricIndex].offsetTop;
                // lyric-wrapcontainer
                this.container.querySelector('.yuanplayer-lyric-container').scrollTop = newScrollTop;
            }
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
    }

    return YuanPlayerLyric;

}));
