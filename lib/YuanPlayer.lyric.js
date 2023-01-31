"use strict";
/* global YuanPlayer, yuanjs */
// @ts-nocheck
if (typeof YuanPlayer === "function") {
    YuanPlayer.prototype.lyricObj = {
        timeArray: [],
        lyricArray: []
    };
    YuanPlayer.prototype.lyricCurrentPosition = 0;
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
            ;
        }
        return result;
    };
    YuanPlayer.prototype.logLyricInfo = function (items) {
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
    YuanPlayer.prototype.ajax = function (options) {
        var dtd = this.Deferred();
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
    };
    YuanPlayer.prototype.Deferred = function () {
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
                    this.ajax({ url: lyric, contentType: "text/plain" }).then(function (lyricText) {
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
}
