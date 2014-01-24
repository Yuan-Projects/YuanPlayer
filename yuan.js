(function (window, undefined) {
    "use strict";

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
                    } else {
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
                    }
                };

                return self;
            }
        };
    }

    /**
     * Helper functions
     *
     */

    function encodeFormatData(data) {
        if (!data) return ""; // Always return a string
        if(typeof data === "string") return data;
        var pairs = []; // To hold name=value pairs
        for(var name in data) { // For each name
            if (!data.hasOwnProperty(name)) continue; // Skip inherited
            if (typeof data[name] === "function") continue; // Skip methods
            var value = data[name].toString(); // Value as string
            name = encodeURIComponent(name.replace(" ", "+")); // Encode name
            value = encodeURIComponent(value.replace(" ", "+")); // Encode value
            pairs.push(name + "=" + value); // Remember name=value pair
        }
        return pairs.join('&'); // Return joined pairs separated with &
    }

    /**
     * Polyfill
     *
     */

    // Emulate the XMLHttpRequest() constructor in IE5 and IE6
    if (window.XMLHttpRequest === undefined) {
        window.XMLHttpRequest = function() {
            try {
                // Use the latest version of the ActiveX object if available
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e1) {
                try {
                    // Otherwise fall back on an older version
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch(e2) {
                    // Otherwise, throw an error
                    throw new Error("XMLHttpRequest is not supported");
                }
            }
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.com/#x15.4.4.18
    if (!Array.prototype.forEach) {

      Array.prototype.forEach = function forEach(callback, thisArg) {
        'use strict';
        var T, k;

        if (this == null) {
          throw new TypeError("this is null or not defined");
        }

        var kValue,
            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            O = Object(this),

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== "[object Function]") {
          throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length >= 2) {
          T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          if (k in O) {

            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[k];

            // ii. Call the Call internal method of callback with T as the this value and
            // argument list containing kValue, k, and O.
            callback.call(T, kValue, k, O);
          }
          // d. Increase k by 1.
          k++;
        }
        // 8. return undefined
      };
    }

    // Poly fill for IE 6
    if (!window.console) {
        window.console = {
            log: function() {
                var args = Array.prototype.slice.call(arguments);
                var str = args.join("\n");
                alert(str);
            }
        };
    }


    /**
     * DOM Manipulation
     *
     */

    function id(id) {
        return document.getElementById(id);
    }

    function tag(tagName) {
        return document.getElementsByTagName(tagName);
    }

    function cssClass(classname, parentNode) {
        var parentNode = parentNode || document;
        if(document.getElementsByClassName) return parentNode.getElementsByClassName(classname);
        var classnameArr = classname.replace(/^\s+|\s+$/g,"").split(/\s+/);
        if(document.querySelectorAll) {
            var classname = "." + classnameArr.join(".");
            return parentNode.querySelectorAll(classname);
        }
        var allTags = parentNode.getElementsByTagName("*");
        var nodes = [];
        if(allTags.length) {
            tagLoop:
            for(var i = 0; i < allTags.length; i++) {
                var tmpTag = allTags[i];
                var tmpClass = tmpTag.className;
                if(!tmpClass) continue tagLoop;
                if (tmpClass === classname) {
                    nodes.push(tmpTag);
                    continue tagLoop;
                }
                matchLoop:
                for(var j = 0; j < classnameArr.length; j++) {
                    var patt = new RegExp("\\b" + classnameArr[j] + "\\b");
                    if(!patt.test(tmpClass)) {
                        continue tagLoop;
                    }
                }
                nodes.push(tmpTag);
            }
        }
        return nodes;
    }


    /**
     * Ajax request
     *
     */

    function ajax(options) {
        var dtd = Deferred();
        var xhr = new XMLHttpRequest();
        var url = options.url;
        var type = options.type ? options.type.toUpperCase() : "GET";
        var isAsyc = !!options.asyc || true;
        var successCallBack = options.success;
        var errorCallBack = options.error;
        var completeCallBack = options.complete;
        var data = options.data ? encodeFormatData(options.data) : "";
        var dataType = options.dataType || "text";
        var contentType = options.contentType || "application/x-www-form-urlencoded";
        var timeout = (options.timeout && !isNaN(options.timeout) && options.timeout > 0) ? options.timeout : 0;
        var timedout = false;
        if(timeout) {
            var timer = setTimeout(function() {
                timedout = true;
                xhr.abort();
                xhr.message = "Canceled";
                dtd.reject(xhr);
            },timeout);
        }

        if(type === "GET" && data !== "") {
            url += "?" + data;
        }
        xhr.open(type, url, isAsyc);
        if(isAsyc) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    callBack();
                }
            }
        }

        xhr.setRequestHeader("Content-Type", contentType);

        switch(type) {
            case "POST":
                xhr.send(data);
                break;
            case "GET":
                xhr.send(null);
        }
        if(!isAsyc) {
            callBack();
        }

        function callBack() {
            if(timedout){
                return;
            }
            clearTimeout(timer);
            var resultText = xhr.responseText;
            var resultXML = xhr.responseXML;
            var textStatus = xhr.statusText;
            completeCallBack && completeCallBack(xhr, textStatus);
            if(xhr.status === 200) {
                var resultType = xhr.getResponseHeader("Content-Type");
                if(dataType === "xml" || (resultType && resultType.indexOf("xml") !== -1 && xhr.responseXML)){
                    successCallBack && successCallBack(resultXML, xhr);
                } else if(dataType === "json" || resultType === "application/json") {
                    successCallBack && successCallBack(JSON.parse(resultText), xhr);
                }else{
                    successCallBack && successCallBack(resultText, xhr);
                }
                dtd.resolve(xhr);
            } else {
                errorCallBack && errorCallBack(xhr.status, xhr);
                dtd.reject(xhr);
            }
        }
        return dtd.promise();
    }

    // Events off and off
    var Events = [];

    function on(event, callback) {
        if (!Events[event]) {
            Events[event] = [];
        }
        Events[event].push(callback);
        return callback;
    }

    function off(event, callback) {
        if (!Events[event]) {
            return ;
        }
        if (callback) {
            var index = Events[event].indexOf(callback);
            if (index !== -1) {
                Events[event].splice(index, 1);
            }
        } else {
            Events[event] = [];
        }
    }

    function trigger (event) {
        if (!Events[event]) {
            return ;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var callbackArray = Events[event];
        for (var i = callbackArray.length - 1; i >= 0; i--) {
            callbackArray[i].apply(callbackArray[i], args);
        };
    }

    window.yuanjs = {};
    yuanjs.Deferred = Deferred;
    yuanjs.ajax = ajax;
    yuanjs.on = on;
    yuanjs.off = off;
    yuanjs.trigger = trigger;
    yuanjs.id = id;
    yuanjs.tag = tag;
    yuanjs.cssClass = cssClass;

})(window, undefined);
