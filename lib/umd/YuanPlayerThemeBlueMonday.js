(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.YuanPlayerThemeBlueMonday = factory());
})(this, (function () { 'use strict';

  function anonymous$2(locals, escapeFn, include, rethrow
  ) {
  rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
    var lines = str.split('\n');
    var start = Math.max(lineno - 3, 0);
    var end = Math.min(lines.length, lineno + 3);
    var filename = esc(flnm);
    // Error context
    var context = lines.slice(start, end).map(function (line, i){
      var curr = i + start + 1;
      return (curr == lineno ? ' >> ' : '    ')
        + curr
        + '| '
        + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'ejs') + ':'
      + lineno + '\n'
      + context + '\n\n'
      + err.message;

    throw err;
  };
  escapeFn = escapeFn || function (markup) {
    return markup == undefined
      ? ''
      : String(markup)
        .replace(_MATCH_HTML, encode_char);
  };
  var _ENCODE_HTML_RULES = {
        "&": "&amp;"
      , "<": "&lt;"
      , ">": "&gt;"
      , '"': "&#34;"
      , "'": "&#39;"
      }
    , _MATCH_HTML = /[&<>'"]/g;
  function encode_char(c) {
    return _ENCODE_HTML_RULES[c] || c;
  }var __line = 1
    , __lines = "<div class=\"jp-audio\" role=\"application\" aria-label=\"media player\">\r\n  <div class=\"jp-type-playlist\">\r\n    <div class=\"jp-gui jp-interface\">\r\n      <div class=\"jp-controls\">\r\n        <button class=\"jp-previous\" role=\"button\" tabindex=\"0\">previous</button>\r\n        <button class=\"jp-play\" role=\"button\" tabindex=\"0\">play</button>\r\n        <button class=\"jp-next\" role=\"button\" tabindex=\"0\">next</button>\r\n        <button class=\"jp-stop\" role=\"button\" tabindex=\"0\">stop</button>\r\n      </div>\r\n      <div class=\"jp-progress\">\r\n        <div class=\"jp-seek-bar\" style=\"width: 100%;\">\r\n          <div class=\"jp-play-bar\" style=\"width: 0%;\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"jp-volume-controls\">\r\n        <button class=\"jp-mute\" role=\"button\" tabindex=\"0\">mute</button>\r\n        <button class=\"jp-volume-max\" role=\"button\" tabindex=\"0\">max volume</button>\r\n        <div class=\"jp-volume-bar\">\r\n          <div class=\"jp-volume-bar-value\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"jp-time-holder\">\r\n        <div class=\"jp-current-time\" role=\"timer\" aria-label=\"time\">00:00</div>\r\n        <div class=\"jp-duration\" role=\"timer\" aria-label=\"duration\">04:27</div>\r\n      </div>\r\n      <div class=\"jp-toggles\">\r\n        <button class=\"jp-repeat\" role=\"button\" tabindex=\"0\">repeat</button>\r\n        <button class=\"jp-shuffle\" role=\"button\" tabindex=\"0\">shuffle</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"
    , __filename = undefined;
  try {
    var __output = "";
    function __append(s) { if (s !== undefined && s !== null) __output += s; }
      ; __append("<div class=\"jp-audio\" role=\"application\" aria-label=\"media player\">\r\n  <div class=\"jp-type-playlist\">\r\n    <div class=\"jp-gui jp-interface\">\r\n      <div class=\"jp-controls\">\r\n        <button class=\"jp-previous\" role=\"button\" tabindex=\"0\">previous</button>\r\n        <button class=\"jp-play\" role=\"button\" tabindex=\"0\">play</button>\r\n        <button class=\"jp-next\" role=\"button\" tabindex=\"0\">next</button>\r\n        <button class=\"jp-stop\" role=\"button\" tabindex=\"0\">stop</button>\r\n      </div>\r\n      <div class=\"jp-progress\">\r\n        <div class=\"jp-seek-bar\" style=\"width: 100%;\">\r\n          <div class=\"jp-play-bar\" style=\"width: 0%;\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"jp-volume-controls\">\r\n        <button class=\"jp-mute\" role=\"button\" tabindex=\"0\">mute</button>\r\n        <button class=\"jp-volume-max\" role=\"button\" tabindex=\"0\">max volume</button>\r\n        <div class=\"jp-volume-bar\">\r\n          <div class=\"jp-volume-bar-value\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"jp-time-holder\">\r\n        <div class=\"jp-current-time\" role=\"timer\" aria-label=\"time\">00:00</div>\r\n        <div class=\"jp-duration\" role=\"timer\" aria-label=\"duration\">04:27</div>\r\n      </div>\r\n      <div class=\"jp-toggles\">\r\n        <button class=\"jp-repeat\" role=\"button\" tabindex=\"0\">repeat</button>\r\n        <button class=\"jp-shuffle\" role=\"button\" tabindex=\"0\">shuffle</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>")
      ; __line = 32;
    return __output;
  } catch (e) {
    rethrow(e, __lines, __filename, __line, escapeFn);
  }

  }

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  n(css$1,{});

  // @ts-ignore
  function getClass$2(Base) {
      return class YuanPlayer extends Base {
          constructor(options) {
              super(options);
              if (this.controls === 'default') {
                  this.renderPlayerUI();
              }
          }
          renderPlayerUI() {
              const div = document.createElement('div');
              div.innerHTML = anonymous$2();
              this.container.appendChild(div);
              const playButton = div.querySelector('.jp-play');
              playButton === null || playButton === void 0 ? void 0 : playButton.addEventListener('click', () => {
                  this.togglePlay();
              });
              const stopButton = div.querySelector('.jp-stop');
              stopButton === null || stopButton === void 0 ? void 0 : stopButton.addEventListener('click', () => {
                  this.stop();
              });
              const currentTimeElement = div.querySelector('.jp-current-time');
              const durationElement = div.querySelector('.jp-duration');
              const audioContainer = div.querySelector('.jp-audio');
              const seekSlider = div.querySelector('.jp-seek-bar');
              const volumeSlider = div.querySelector('.jp-volume-bar');
              const muteButton = div.querySelector('.jp-mute');
              const volumeMaxButton = div.querySelector('.jp-volume-max');
              volumeMaxButton === null || volumeMaxButton === void 0 ? void 0 : volumeMaxButton.addEventListener('click', () => {
                  this.mediaObject.volume = 1;
                  this.unmute();
              });
              muteButton === null || muteButton === void 0 ? void 0 : muteButton.addEventListener('click', () => {
                  this.toggleMute();
              });
              volumeSlider === null || volumeSlider === void 0 ? void 0 : volumeSlider.addEventListener('click', (e) => {
                  const perc = e.offsetX / parseFloat(getComputedStyle(volumeSlider).width);
                  this.mediaObject.volume = perc;
              });
              seekSlider === null || seekSlider === void 0 ? void 0 : seekSlider.addEventListener('click', (e) => {
                  const perc = e.offsetX / parseFloat(getComputedStyle(seekSlider).width);
                  this.mediaObject.currentTime = this.mediaObject.duration * perc;
              });
              this.on('play', () => {
                  audioContainer === null || audioContainer === void 0 ? void 0 : audioContainer.classList.add('jp-state-playing');
              });
              this.on('pause', () => {
                  audioContainer === null || audioContainer === void 0 ? void 0 : audioContainer.classList.remove('jp-state-playing');
              });
              this.on('durationchange', () => {
                  if (durationElement) {
                      durationElement.textContent = this.formatTime(Math.floor(this.mediaObject.duration));
                  }
              });
              this.on('timeupdate', () => {
                  const second = Math.floor(this.mediaObject.currentTime);
                  if (currentTimeElement) {
                      currentTimeElement.textContent = this.formatTime(second);
                  }
                  this.container.querySelector('.jp-play-bar').style.width = `${this.mediaObject.currentTime / this.mediaObject.duration * 100}%`;
              });
              this.on('volumechange', () => {
                  this.updateVolume();
              });
              this.updateVolume();
          }
          updateVolume() {
              const audioContainer = this.container.querySelector('.jp-audio');
              if (this.mediaObject.muted) {
                  audioContainer.classList.add('jp-state-muted');
              }
              else {
                  audioContainer.classList.remove('jp-state-muted');
              }
              const ele = this.container.querySelector('.jp-volume-bar-value');
              const val = Math.trunc(this.mediaObject.volume * 100);
              ele.style.width = this.mediaObject.muted ? '0%' : val + "%";
          }
      };
  }

  const innerText = function (element, text) {
      (typeof element.textContent !== 'undefined') ? (element.textContent = text) : (element.innerText = text);
  };

  var css = ".yuanplayer-lyric-bluemonday-container {\n  max-width: 500px;\n  box-sizing: border-box;\n  margin-top: 0;\n  border-radius: 5px;\n  text-align: center;\n  height: 100px;\n  border: 1px solid blue;\n  overflow: hidden;\n  padding-top: 50px;\n  margin-left: auto;\n  margin-right: auto;\n  background: #ccc;\n  font-size: 14px;\n  /* Make all lyric items relative to the container */ }\n  .yuanplayer-lyric-bluemonday-container div {\n    margin-bottom: 5px;\n    min-height: 1em;\n    /* Make the empty lyric container visible. */ }\n  .yuanplayer-lyric-bluemonday-container .lyric-wrapcontainer {\n    position: relative; }\n  .yuanplayer-lyric-bluemonday-container .highlight {\n    font-weight: bold;\n    color: #0d88c1; }\n\n/* For mobile devices */\n@media (max-width: 768px) {\n  .yuanplayer-lyric-bluemonday-container {\n    width: 90%; } }\n";
  n(css,{});

  function getClass$1(Base) {
      return class YuanPlayerLyric extends Base {
          constructor(otpions) {
              super(otpions);
              this.addContainer();
              this.on('lyricFetched', (lyricItems) => {
                  debugger;
                  this.container.querySelector('.yuanplayer-lyric-bluemonday-container').scrollTop = 0;
                  this.addLyricItems(lyricItems);
              });
              this.on('timeupdated', (currentTime) => {
                  this.scrollLyric(currentTime);
              });
              this.on('reset', () => {
                  this.container.querySelector('.lyric-wrapcontainer').innerHTML = '<div>No lyric available.</div>';
              });
          }
          addContainer() {
              if (typeof this.lyric === 'string') {
                  if (!this.container.querySelector('.yuanplayer-lyric-bluemonday-container')) {
                      // Add container for lyric
                      var lyricDiv = document.createElement('div');
                      var wrapContainer = document.createElement('div');
                      lyricDiv.classList.add('yuanplayer-lyric-bluemonday-container');
                      wrapContainer.classList.add('lyric-wrapcontainer');
                      this.container.appendChild(lyricDiv);
                      lyricDiv.appendChild(wrapContainer);
                  }
                  else {
                      const lyricContainer = this.container.querySelector('.yuanplayer-lyric-bluemonday-container');
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
                  this.container.querySelector('.yuanplayer-lyric-bluemonday-container').scrollTop = newScrollTop;
              }
          }
      };
  }

  function anonymous$1(locals, escapeFn, include, rethrow
  ) {
  rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
    var lines = str.split('\n');
    var start = Math.max(lineno - 3, 0);
    var end = Math.min(lines.length, lineno + 3);
    var filename = esc(flnm);
    // Error context
    var context = lines.slice(start, end).map(function (line, i){
      var curr = i + start + 1;
      return (curr == lineno ? ' >> ' : '    ')
        + curr
        + '| '
        + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'ejs') + ':'
      + lineno + '\n'
      + context + '\n\n'
      + err.message;

    throw err;
  };
  escapeFn = escapeFn || function (markup) {
    return markup == undefined
      ? ''
      : String(markup)
        .replace(_MATCH_HTML, encode_char);
  };
  var _ENCODE_HTML_RULES = {
        "&": "&amp;"
      , "<": "&lt;"
      , ">": "&gt;"
      , '"': "&#34;"
      , "'": "&#39;"
      }
    , _MATCH_HTML = /[&<>'"]/g;
  function encode_char(c) {
    return _ENCODE_HTML_RULES[c] || c;
  }var __line = 1
    , __lines = "<div class=\"jp-type-playlist\">\r\n  <div class=\"jp-playlist\">\r\n    <% if (locals.tracks.length) { %>\r\n    <ul style=\"display: block;\">\r\n      <% locals.tracks.forEach(function(track, index){ %>\r\n        <li>\r\n          <div>\r\n            <a href=\"javascript:;\" class=\"jp-playlist-item-remove\" style=\"display: none;\">×</a>\r\n            <a href=\"javascript:;\" class=\"jp-playlist-item\" data-index=\"<%= index %>\" data-trackid=\"<%= track.id %>\" tabindex=\"0\"><%= track.title %></a>\r\n          </div>\r\n        </li>\r\n      <% }); %>\r\n    </ul>\r\n    <% } else { %>\r\n      <div class=\"jp-playlist-empty\">The playlist is empty.</div>\r\n    <% } %>\r\n  </div>\r\n</div>"
    , __filename = undefined;
  try {
    var __output = "";
    function __append(s) { if (s !== undefined && s !== null) __output += s; }
      ; __append("<div class=\"jp-type-playlist\">\r\n  <div class=\"jp-playlist\">\r\n    ")
      ; __line = 3
      ;  if (locals.tracks.length) { 
      ; __append("\r\n    <ul style=\"display: block;\">\r\n      ")
      ; __line = 5
      ;  locals.tracks.forEach(function(track, index){ 
      ; __append("\r\n        <li>\r\n          <div>\r\n            <a href=\"javascript:;\" class=\"jp-playlist-item-remove\" style=\"display: none;\">×</a>\r\n            <a href=\"javascript:;\" class=\"jp-playlist-item\" data-index=\"")
      ; __line = 9
      ; __append(escapeFn( index ))
      ; __append("\" data-trackid=\"")
      ; __append(escapeFn( track.id ))
      ; __append("\" tabindex=\"0\">")
      ; __append(escapeFn( track.title ))
      ; __append("</a>\r\n          </div>\r\n        </li>\r\n      ")
      ; __line = 12
      ;  }); 
      ; __append("\r\n    </ul>\r\n    ")
      ; __line = 14
      ;  } else { 
      ; __append("\r\n      <div class=\"jp-playlist-empty\">The playlist is empty.</div>\r\n    ")
      ; __line = 16
      ;  } 
      ; __append("\r\n  </div>\r\n</div>")
      ; __line = 18;
    return __output;
  } catch (e) {
    rethrow(e, __lines, __filename, __line, escapeFn);
  }

  }

  function anonymous(locals, escapeFn, include, rethrow
  ) {
  rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
    var lines = str.split('\n');
    var start = Math.max(lineno - 3, 0);
    var end = Math.min(lines.length, lineno + 3);
    var filename = esc(flnm);
    // Error context
    var context = lines.slice(start, end).map(function (line, i){
      var curr = i + start + 1;
      return (curr == lineno ? ' >> ' : '    ')
        + curr
        + '| '
        + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'ejs') + ':'
      + lineno + '\n'
      + context + '\n\n'
      + err.message;

    throw err;
  };
  escapeFn = escapeFn || function (markup) {
    return markup == undefined
      ? ''
      : String(markup)
        .replace(_MATCH_HTML, encode_char);
  };
  var _ENCODE_HTML_RULES = {
        "&": "&amp;"
      , "<": "&lt;"
      , ">": "&gt;"
      , '"': "&#34;"
      , "'": "&#39;"
      }
    , _MATCH_HTML = /[&<>'"]/g;
  function encode_char(c) {
    return _ENCODE_HTML_RULES[c] || c;
  }var __line = 1
    , __lines = "  <div>\r\n    <a href=\"javascript:;\" class=\"jp-playlist-item-remove\" style=\"display: none;\">×</a>\r\n    <a href=\"javascript:;\" class=\"jp-playlist-item\" data-index=\"<%= locals.index %>\" data-trackid=\"<%= locals.track.id %>\" tabindex=\"0\"><%= locals.track.title %></a>\r\n  </div>"
    , __filename = undefined;
  try {
    var __output = "";
    function __append(s) { if (s !== undefined && s !== null) __output += s; }
      ; __append("  <div>\r\n    <a href=\"javascript:;\" class=\"jp-playlist-item-remove\" style=\"display: none;\">×</a>\r\n    <a href=\"javascript:;\" class=\"jp-playlist-item\" data-index=\"")
      ; __line = 3
      ; __append(escapeFn( locals.index ))
      ; __append("\" data-trackid=\"")
      ; __append(escapeFn( locals.track.id ))
      ; __append("\" tabindex=\"0\">")
      ; __append(escapeFn( locals.track.title ))
      ; __append("</a>\r\n  </div>")
      ; __line = 4;
    return __output;
  } catch (e) {
    rethrow(e, __lines, __filename, __line, escapeFn);
  }

  }

  // @ts-ignore
  function getClass(Base) {
      return class YuanPlayerPlayList extends Base {
          constructor(options) {
              super(options);
              this.on('playMusicAtIndex', (index) => {
                  this.updateHighlight();
              });
              this.renderUI();
              this.on('modeChanged', this.renderModeIcon.bind(this));
              this.on('shuffledChanged', () => {
                  this.updateShuffleIcon();
                  this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = anonymous$1({ tracks: this.list });
                  this.updateHighlight();
              });
              this.on('trackRemoved', (trackItemId) => {
                  const ele = this.container.querySelector(`a[data-trackid="${trackItemId}"]`).parentNode.parentNode;
                  ele.parentNode.removeChild(ele);
                  if (this.list.length === 0) {
                      this.container.querySelector('.jp-playlist').innerHTML = '<div class="jp-playlist-empty">The playlist is empty.</div>';
                  }
                  this.updateHighlight();
              });
              this.on('trackAdded', (trackItem) => {
                  debugger;
                  if (this.list.length === 1) {
                      this.container.querySelector('.jp-playlist').removeChild(this.container.querySelector('.jp-playlist-empty'));
                  }
                  const ul = this.container.querySelector('.jp-playlist ul');
                  const li = document.createElement('li');
                  li.innerHTML = anonymous({ index: this.list.length - 1, track: trackItem });
                  ul.appendChild(li);
              });
              const previousButton = this.player.container.querySelector('.jp-previous');
              previousButton === null || previousButton === void 0 ? void 0 : previousButton.addEventListener('click', () => {
                  this.playPreviousTrack();
              });
              const nextButton = this.player.container.querySelector('.jp-next');
              nextButton === null || nextButton === void 0 ? void 0 : nextButton.addEventListener('click', () => {
                  this.playNextTrack();
              });
              const repeatButton = this.player.container.querySelector('.jp-repeat');
              repeatButton === null || repeatButton === void 0 ? void 0 : repeatButton.addEventListener('click', () => {
                  this.toggleRepeatAllMode();
              });
              const shuffleButton = this.player.container.querySelector('.jp-shuffle');
              shuffleButton === null || shuffleButton === void 0 ? void 0 : shuffleButton.addEventListener('click', () => {
                  if (this.shuffled) {
                      this.restore();
                  }
                  else {
                      this.shuffle();
                  }
              });
          }
          renderUI() {
              const div = document.createElement('div');
              div.className = 'yuanplayer-bluemonday-playlist';
              div.innerHTML = anonymous$1({ tracks: this.list });
              this.container.appendChild(div);
              div.addEventListener('click', (e) => {
                  var _a, _b, _c, _d;
                  const target = e.target;
                  if ((_a = target === null || target === void 0 ? void 0 : target.classList) === null || _a === void 0 ? void 0 : _a.contains('jp-playlist-item')) {
                      if (target.classList.contains('jp-playlist-current')) {
                          // do nothing
                          return;
                      }
                      this.index = parseInt(target.getAttribute('data-index') || '');
                      this.playAtIndex(this.index);
                  }
                  if ((_b = target === null || target === void 0 ? void 0 : target.classList) === null || _b === void 0 ? void 0 : _b.contains('jp-playlist-item-remove')) {
                      this.remove((_d = (_c = target.parentNode) === null || _c === void 0 ? void 0 : _c.querySelector('.jp-playlist-item')) === null || _d === void 0 ? void 0 : _d.getAttribute('data-trackid'));
                  }
              });
              this.updateHighlight();
          }
          toggleRepeatAllMode() {
              if (Base.modes[this.modeIndex] === 'all') {
                  this.setMode('off');
              }
              else {
                  this.setMode('all');
              }
          }
          updateShuffleIcon() {
              if (!this.player)
                  return;
              const playerContainer = this.player.container;
              const audioContainer = playerContainer.querySelector('.jp-audio');
              if (this.shuffled) {
                  audioContainer.classList.add('jp-state-shuffled');
              }
              else {
                  audioContainer.classList.remove('jp-state-shuffled');
              }
          }
          renderModeIcon() {
              if (!this.player)
                  return;
              const playerContainer = this.player.container;
              const audioContainer = playerContainer.querySelector('.jp-audio');
              if (Base.modes[this.modeIndex] === 'all') {
                  audioContainer.classList.add('jp-state-looped');
              }
              else {
                  audioContainer.classList.remove('jp-state-looped');
              }
          }
          updateHighlight() {
              const playlistCOntainer = this.container.querySelector('.jp-playlist');
              if (!playlistCOntainer)
                  return;
              const highlightEl = playlistCOntainer.querySelector('li.jp-playlist-current');
              if (highlightEl) {
                  highlightEl.classList.remove('jp-playlist-current');
                  highlightEl.querySelector('a.jp-playlist-current').classList.remove('jp-playlist-current');
              }
              const newHighlightEl = playlistCOntainer.querySelectorAll('li')[this.index];
              if (newHighlightEl) {
                  newHighlightEl.classList.add('jp-playlist-current');
                  newHighlightEl.querySelector('a.jp-playlist-item').classList.add('jp-playlist-current');
              }
          }
      };
  }

  const obj = {
      name: 'blueMonday',
      Player: getClass$2,
      Lyric: getClass$1,
      PlayList: getClass
  };

  return obj;

}));