'use strict';

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
        this.index = 0;
        this.list = [];
        this.modeIndex = 0;
        this.container = options.container;
        this.modeIndex = PlayListBase.modes.indexOf(options.loop) > -1 ? PlayListBase.modes.indexOf(options.loop) : 0;
        this.player = options.player;
        this.lyricObj = options.lyricObj;
        this.list = options.list;
        this.addEvents();
    }
    switchModes() {
        const newVal = (++this.modeIndex) % PlayListBase.modes.length;
        this.modeIndex = newVal;
        this.trigger('modeChanged');
    }
    addEvents() {
        this.on('playMusicAtIndex', (index) => {
            if (this.lyricObj) {
                this.lyricObj.lyric = this.list[index].lyric;
                this.lyricObj.addLyric();
            }
        });
        this.player.mediaObject.addEventListener('ended', () => {
            if (PlayListBase.modes[this.modeIndex] === 'none') {
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
            else if (PlayListBase.modes[this.modeIndex] === 'random') {
                this.index = Math.floor(Math.random() * this.list.length);
                // Play the new one
            }
            else if (PlayListBase.modes[this.modeIndex] === 'single') ;
            else if (PlayListBase.modes[this.modeIndex] === 'order') {
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
PlayListBase.modes = ['none', 'single', 'random', 'order'];

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = "/* fallback */\r\n@font-face {\r\n  font-family: 'Material Symbols Outlined';\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v83/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOej.woff2) format('woff2');\r\n}\r\n\r\n.material-symbols-outlined {\r\n  font-family: 'Material Symbols Outlined';\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 24px;\r\n  line-height: 1;\r\n  letter-spacing: normal;\r\n  text-transform: none;\r\n  display: inline-block;\r\n  white-space: nowrap;\r\n  word-wrap: normal;\r\n  direction: ltr;\r\n  -webkit-font-feature-settings: 'liga';\r\n  -webkit-font-smoothing: antialiased;\r\n}\n.yuanplay-playlist-container {\n  padding: 1em;\n}\n.yuanplay-playlist-container .music-item-container {\n  margin: 1rem auto;\n  cursor: pointer;\n  display: flex;\n  gap: 1em;\n  align-items: center;\n}\n.yuanplay-playlist-container .music-item-container:hover {\n  outline: 1px dotted black;\n}\n.yuanplay-playlist-container .music-item-container .imgurl {\n  width: 3rem;\n  height: 3rem;\n}\n.yuanplay-playlist-container .music-item-container.active {\n  color: red;\n}\n.yuanplay-playlist-container .operation-container {\n  display: flex;\n  gap: 1em;\n  border-top: 1px solid black;\n}\n.yuanplay-playlist-container .yuanplayer-mode-container {\n  cursor: pointer;\n}";
n(css,{});

class YuanPlayerPlayList extends PlayListBase {
    constructor(options) {
        super(options);
        this.on('playMusicAtIndex', (index) => {
            this.playAtIndex(index);
            this.updateHighlight();
        });
        this.renderUI();
        this.on('modeChanged', this.renderModeIcon.bind(this));
    }
    renderUI() {
        const container = this.container;
        const playlistContainer = document.createElement('div');
        playlistContainer.classList.add('yuanplay-playlist-container');
        const itemList = document.createElement('div');
        this.list.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('music-item-container');
            if (item.imgUrl) {
                const imgEle = document.createElement('img');
                imgEle.classList.add('imgurl');
                imgEle.src = item.imgUrl;
                div.appendChild(imgEle);
            }
            const titleEle = document.createElement('span');
            titleEle.textContent = item.title;
            div.appendChild(titleEle);
            if (item.artist) {
                const artistEle = document.createTextNode(item.artist);
                artistEle.textContent = item.artist;
                div.appendChild(artistEle);
            }
            itemList.appendChild(div);
            div.addEventListener('click', () => {
                this.index = index;
                this.trigger('playMusicAtIndex', index);
            });
        });
        playlistContainer.appendChild(itemList);
        const opContainer = document.createElement('div');
        opContainer.classList.add('operation-container');
        const previousButton = document.createElement('button');
        previousButton.textContent = 'Previous';
        opContainer.appendChild(previousButton);
        previousButton.addEventListener('click', () => {
            if (this.index === 0)
                return false;
            this.trigger('playMusicAtIndex', --this.index);
        });
        const nextButton = document.createElement('button');
        nextButton.textContent = 'next';
        nextButton.addEventListener('click', () => {
            if (this.index === this.list.length - 1)
                return false;
            this.trigger('playMusicAtIndex', ++this.index);
        });
        opContainer.appendChild(nextButton);
        const modeContainer = document.createElement('span');
        modeContainer.classList.add('yuanplayer-mode-container');
        modeContainer.classList.add('material-symbols-outlined');
        opContainer.appendChild(modeContainer);
        modeContainer.addEventListener('click', () => {
            this.switchModes();
        });
        playlistContainer.appendChild(opContainer);
        container.appendChild(playlistContainer);
        this.updateHighlight();
        this.renderModeIcon();
    }
    playAtIndex(index) {
        this.player.setMedia(this.list[index].source);
        this.player.mediaObject.load();
        this.player.play();
        this.updateHighlight();
    }
    renderModeIcon() {
        const element = this.container.querySelector('.yuanplayer-mode-container');
        if (!element)
            return;
        let text = '';
        // 'none' | 'single' | 'random' | 'order'
        switch (PlayListBase.modes[this.modeIndex]) {
            case 'single':
                text = 'repeat_one_on';
                break;
            case 'random':
                text = 'shuffle_on';
                break;
            case 'order':
                text = 'repeat_on';
                break;
            case 'none':
            default:
                text = 'repeat';
                break;
        }
        element.textContent = text;
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

module.exports = YuanPlayerPlayList;
