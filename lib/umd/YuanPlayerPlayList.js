(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.YuanPlayerPlayList = factory());
})(this, (function () { 'use strict';

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

  class PlayListBase extends Emitter {
      constructor(options) {
          super();
          this.loop = 'none';
          this.index = 0;
          this.list = [];
          this.container = options.container;
          this.loop = options.loop || 'none';
          this.player = options.player;
          this.list = options.list;
          this.addEvents();
      }
      addEvents() {
          this.player.mediaObject.addEventListener('ended', () => {
              if (this.loop === 'none') {
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
              else if (this.loop === 'random') {
                  this.index = Math.floor(Math.random() * this.list.length);
                  // Play the new one
              }
              else if (this.loop === 'single') ;
              else if (this.loop === 'order') {
                  if (this.index === this.list.length - 1) {
                      // Reach the end;
                      this.index = 0;
                  }
                  else {
                      this.index++;
                      // Play the next one in the list
                  }
              }
              //playMusicAtIndex(index);
              this.trigger('playMusicAtIndex', this.index);
          });
      }
  }

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".yuanplay-playlist-container .music-item-container {\n  margin: 1rem auto;\n  cursor: pointer;\n}\n.yuanplay-playlist-container .music-item-container.active {\n  color: red;\n}";
  n(css,{});

  class YuanPlayerPlayList extends PlayListBase {
      constructor(options) {
          super(options);
          this.on('playMusicAtIndex', (index) => {
              this.playAtIndex(index);
              this.updateHighlight();
          });
          this.renderUI();
      }
      renderUI() {
          const container = this.container;
          const playlistContainer = document.createElement('div');
          playlistContainer.classList.add('yuanplay-playlist-container');
          this.list.forEach((item, index) => {
              const div = document.createElement('div');
              div.classList.add('music-item-container');
              div.textContent = item.title;
              playlistContainer.appendChild(div);
              div.addEventListener('click', () => {
                  this.index = index;
                  this.playAtIndex(index);
                  this.updateHighlight();
              });
          });
          container.appendChild(playlistContainer);
          this.updateHighlight();
      }
      playAtIndex(index) {
          this.player.setMedia(this.list[index].source);
          this.player.mediaObject.load();
          this.player.play();
      }
      updateHighlight() {
          var _a;
          const playlistCOntainer = this.container.querySelector('.yuanplay-playlist-container');
          if (!playlistCOntainer)
              return;
          (_a = playlistCOntainer.querySelector('.active')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
          playlistCOntainer.querySelectorAll('.music-item-container')[this.index].classList.add('active');
      }
  }

  return YuanPlayerPlayList;

}));
