(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@rainyjune/yuanjs')) :
  typeof define === 'function' && define.amd ? define(['@rainyjune/yuanjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.YuanPlayerLyric = factory());
})(this, (function () { 'use strict';

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

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".yuanplayer-lyric-container {\n  margin-top: 2em;\n  border-radius: 5px;\n  text-align: center;\n  height: 100px;\n  border: 1px solid blue;\n  overflow: hidden;\n  padding-top: 50px;\n  margin-left: auto;\n  margin-right: auto;\n  /* Make all lyric items relative to the container */\n}\n.yuanplayer-lyric-container div {\n  margin-bottom: 5px;\n  min-height: 1em; /* Make the empty lyric container visible. */\n}\n.yuanplayer-lyric-container .lyric-wrapcontainer {\n  position: relative;\n}\n.yuanplayer-lyric-container .highlight {\n  font-weight: bold;\n  color: red;\n}\n\n/* For mobile devices */\n@media (max-width: 768px) {\n  .yuanplayer-lyric-container {\n    width: 90%;\n  }\n}";
  n(css,{});

  class YuanPlayerLyric extends LyricBase {
      constructor(otpions) {
          super(otpions);
          this.addContainer();
          this.on('lyricFetched', (lyricItems) => {
              this.container.querySelector('.yuanplayer-lyric-container').scrollTop = 0;
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
          wrapContainer.innerHTML = '';
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
  }

  return YuanPlayerLyric;

}));
